FROM node:alpine

LABEL author="tutk0"

ARG buildversion

ENV NODE_ENV=development
ENV PORT=3000
ENV BUILD=$buildversion

WORKDIR /var/www
COPY package.json package-lock.json ./
RUN npm install

COPY . ./
EXPOSE $PORT

RUN echo "Build version: $build"

ENTRYPOINT ["npm", "start"]