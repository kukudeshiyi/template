FROM nginx:1.15-alpine
COPY ./dist /etc/nginx/html
COPY ./deploy/ngnix.conf /etc/nginx/ngnix.conf
WORKDIR /etc/nginx/html
