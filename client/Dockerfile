FROM node:18-buster as builder

WORKDIR /src

COPY . /src
RUN ["chmod", "+x", "src/scripts/dockerbuild.sh"]
RUN src/scripts/dockerbuild.sh

FROM nginxinc/nginx-unprivileged:alpine

COPY --from=builder /src/dist/pwa /app
COPY src/config/default.conf /etc/nginx/conf.d/

USER root

RUN rm -rf /usr/share/nginx/html

USER 101
