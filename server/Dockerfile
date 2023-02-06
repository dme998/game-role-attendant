FROM node:alpine

LABEL author="tutk0"

ARG buildversion

ENV PORT=3000
ENV BUILD=$buildversion
ENV REDIS_URL=redis://redis:6379

WORKDIR /var/www
COPY package.json package-lock.json ./
RUN npm install

COPY . ./
EXPOSE $PORT

RUN echo "Build version: $build"

ENTRYPOINT ["npm", "start"]