FROM nginx:1.15-alpine
COPY ./dist/html /etc/nginx/html
COPY ./deploy/conf /etc/nginx/
WORKDIR /etc/nginx/html
