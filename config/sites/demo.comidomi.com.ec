server {
  listen 80;

  server_name demo.comidomi.com.ec
              www.demo.comidomi.com.ec;

  return 301 https://$server_name$request_uri;
}

server {
  listen 443 ssl;

  server_name demo.comidomi.com.ec
              www.demo.comidomi.com.ec;

  ssl_certificate /etc/letsencrypt/live/demo.comidomi.com.ec/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/demo.comidomi.com.ec/privkey.pem;

  include snippets/secure-ssl.conf;

  charset utf-8;
  root /home/porttare/demo-porttare-frontend-comidomi/current/www;

  location ~ /.well-known {
    allow all;
  }

  location ^~ /assets/ {
    gzip_static on;
    expires max;
    add_header Cache-Control public;
  }

  # cache.appcache, your document html and data
  location ~* \.(?:manifest|appcache|html?|xml|json)$ {
    expires -1;
  }

  # cache templates
  location ^~ /templates {
    # I think ideally we'll bump this
    # once we are done with the building
    expires 24h;
    access_log off;
    gzip_static on;
    add_header Cache-Control "public";
  }

  # Media: images, icons, video, audio, HTC
  location ~* \.(?:jpg|jpeg|gif|png|ico|cur|gz|svg|svgz|mp4|ogg|ogv|webm|htc)$ {
    expires 1M;
    gzip_static on;
    add_header Cache-Control "public";
  }

  # CSS and Javascript
  location ~* \.(?:css|js)$ {
    # I think ideally we'll bump this
    # once we are done with the building
    expires 24h;
    access_log off;
    gzip_static on;
    add_header Cache-Control "public";
  }

  # WebFonts
  location ~* \.(?:ttf|ttc|otf|eot|woff|woff2)$ {
    expires 1y;
    access_log off;
    gzip_static on;
    add_header Cache-Control "public";
  }

  error_page 500 502 503 504 /500.html;
  keepalive_timeout 10;
  client_max_body_size 4G;
}
