require('dotenv').config()

const exec = require('child-process-promise').exec
const scp = require('node-scp')
const Liquid = require('liquid')
const engine = new Liquid.Engine()
const fs = require('mz/fs')


const sourceDirectory = './streamRIP'
const buildDirectory = './build'
const buildProcesses = {
    'config.sh': {
        build: async (template) => {
            
            return engine.parseAndRender(template, {
                destinationPath: process.env.DESTINATION_PATH,
                offlineFile: process.env.OFFLINE_VIDEO_FILE,
                streamKey: process.env.STREAM_KEY,
                twitchServer: process.env.TWITCH_SERVER,
                twitchStreamKey: process.env.TWITCH_STREAM_KEY
            })
        }
    },
    'nginx_start.sh': {
        build: contents => contents
    },
    'publish_start.sh': {
        build: contents => contents
    },
    'publish_stop.sh': {
        build: contents => contents
    },
    'streamrip.conf': {
        build: async (template) => {
            
            return engine.parseAndRender(template, {
                destinationPath: process.env.DESTINATION_PATH
            })
        }
    },
    'util.sh': {
        build: contents => contents
    },
    
}

async function deploy() {

    await exec(`rm -rf ${buildDirectory}`)
    await exec(`mkdir ${buildDirectory}`)

    console.log('Building...')
    for (let filename in buildProcesses) {

        if (!buildProcesses.hasOwnProperty(filename)) {
            continue;
        }
        
        let contents = await fs.readFile(`${sourceDirectory}/${filename}.template`, 'utf8')
        contents = await buildProcesses[filename].build(contents)
        await fs.writeFile(`${buildDirectory}/${filename}`, contents)
    }

    console.log('Deploying to server...')
    const client = await scp({
        host: process.env.SERVER_IP,
        port: 22,
        username: process.env.SERVER_USER,
        password: process.env.SERVER_PASSWORD,
    })
    
    try {
        const exists = await client.exists(`${process.env.DESTINATION_PATH}`)
        if (!exists) await client.mkdir(`${process.env.DESTINATION_PATH}`)
        await client.uploadDir(`${buildDirectory}`, `${process.env.DESTINATION_PATH}`)
        await client.uploadFile(`${buildDirectory}/streamrip.conf`, `${process.env.NGINX_CONF}`)
        //await client.uploadFile(`./static/${process.env.OFFLINE_VIDEO_FILE}`, `${process.env.DESTINATION_PATH}`) this doesn't work
    }
    catch(e) {
        console.log(e.stack)
        process.exit(1)
    }
    
    client.close()
    console.log('Completed deployment!')
    process.exit()
}

deploy()