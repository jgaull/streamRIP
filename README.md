# streamRIP

streamRIP is a simple set of bash scripts for use with the NGINX RTMP module.

It provides a "fallback" stream for when a main stream disconnects, so the stream never truly goes offline on the client side.


## Requirements
* NGINX compiled with the [NGINX RTMP module](https://github.com/arut/nginx-rtmp-module)
* FFmpeg

## Configuration
Configuration is done in `config.sh`, there are a few things you must change in this file:

* `offfi`

   The file to loop when the main stream is offline. This should be the full path to the file, and it must be in a location that is readable by nginx.

   The file should have as close as possible to the same encoding parameters as your actual stream, including resolution and bitrate.

* `secret`

   The "stream key" for streamRIP, should be a random, unguessable string. Note that this does *not* need to be the stream key for the service you're streaming on, it is only used by streamRIP.

* `rtmpe`

   The RTMP endpoint to stream to, this would be the server of whatever service you're streaming on, for Twitch it would look something like ` rtmp://live-abc.twitch.tv/app/{stream_key}
 `

* `rtmpi`

   The RTMP ingest server, this is the stream streamRIP will pull from as the "main" stream. You usually won't have to change this if you're using the provided streamRIP NGINX config.

## Installation
Copy the script into a location nginx will be able to read.
The suggested and default location is `/usr/share/nginx/streamRIP/`

If you install the script somewhere besides the default location, you will have to update the `streamrip.conf` file with the proper script location.

After the scripts are copied and updated if needed, copy the streamrip.conf to the location where your NGINX config file is located, you can either replace it entirely with the streamRIP config file, or transfer the rtmp section into an existing config file.

## Usage
After NGINX is started, you can set your live streaming program to stream to `rtmp://{ip}/live`, with your stream key set to the secret value you included in `config.sh`. `{ip}` should be the IP of the server NGINX is being hosted on.

Once you start streaming, your stream should begin on the streaming service.

If you go offline during the stream, the video you specific in `config.sh` will begin to loop until you go back online or NGINX is shut down.

## Handy Commands

* `ssh root@144.202.101.107`

   Remote SSH into the server

* `nano /usr/share/nginx/streamRIP/config.sh`

   Edit the streamRIP config.

* `sudo nano /usr/local/nginx/conf/nginx.conf`

   Edit the nginx config.

* `scp [video file] root@144.202.101.107:/usr/share/nginx/streamRIP/.`

   Copy a video file to the streamRIP directory.

* `cp /usr/share/nginx/streamRIP/streamrip.conf /usr/local/nginx/conf/nginx.conf`

   Replace the nginx configuration file with the streamRIP configuration file.

* `systemctl status nginx.service`

   Test the status of the nginx service.

* `sudo service nginx restart`

   Restart nginx.

* `sudo nginx -t`

   Test the nginx config file.

* `http://nginx.org/en/download.html`

   The latest version of nginx.

* `https://www.vultr.com/docs/setup-nginx-rtmp-on-ubuntu-14-04`

   Vultr setup of RTMP.

* `./configure --with-http_ssl_module --add-module=../nginx-rtmp-module-master --without-http_gzip_module --with-cc-opt="-Wimplicit-fallthrough=0"`

   Configuring nginx before compiling to include the RTMP module. This version of the command does not throw the gzip error.

* `rtmp://live-sjc05.twitch.tv/app/`

   Closest twitch server (to home, but probably Vultr as well)

* `sudo apt install gcc`

   Install C compiler.

* `wget http://nginx.org/download/nginx-1.19.2.tar.gz`

   Download the latest version of nginx (as of writing).

* don't forget to sudo apt-get update
* `sudo apt install make`

   Install make

* `sudo add-apt-repository ppa:kirillshkrogalev/ffmpeg-next`

   Add the ffmpeg repo?

* `tail -f /var/log/nginx/error.log`

   Read nginx logs.