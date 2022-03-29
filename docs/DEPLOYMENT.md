# Deployment

Follow the next steps to successfully configure and deploy the project

## Build

To build the project run the next on your local machine

```
npm run build
```

After a successful build move the files and folders included below in a folder on your server

- .next
- .env.local
- next.config.js
- LICENSE
- package.json
- public

**Don't forget to install dependencies with `npm i` before starting up an application**

## PM2

Before proceeding make sure that [PM2](https://pm2.keymetrics.io/) is installed on your machine. To run the application build type in

```
pm2 start npm --name "NL-Client" --log /PATH/nl-next.log --time -- run "start" -p PORT
```

**Remember to set up autostart in case you haven't done it yet**

## NGINX

Create the configuration file in **/etc/nginx/sites-available** folder. Use this template

```nginx
server {
    root /PATH;
    index index.html;
    server_name DOMAIN;

    location / {
        # Define the port the application runs on
        proxy_pass http://localhost:PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /static/ {
        add_header X-Robots-Tag "noindex, nofollow, nosnippet, noarchive";
        # Path to a folder where all static is stored
        alias /PATH/static/;
    }
}
```

Then run this script to create a symbolic link

```
ln -s /etc/nginx/sites-available/DOMAIN /etc/nginx/sites-enabled/DOMAIN
```

## SSL

First thing first, install [certbot](https://certbot.eff.org/) on your machine. To certificate and secure a connection to the application run the this script

```
sudo certbot --nginx -d DOMAIN
```

After that your nginx config should look like it

```nginx
server {
    root /PATH;
    index index.html;
    server_name DOMAIN;
    listen [::]:443 ssl; # managed by Certbot
    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/DOMAIN/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/DOMAIN/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

    location / {
        proxy_pass http://localhost:PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /static/ {
        add_header X-Robots-Tag "noindex, nofollow, nosnippet, noarchive";
        alias /home/vlad/nl/static/;
    }
}

server {
    if ($host = DOMAIN) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

        listen 80;
        listen [::]:80;
        server_name DOMAIN;
    return 404; # managed by Certbot
}
```
