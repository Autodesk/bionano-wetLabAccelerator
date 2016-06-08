#Docker file for local building and serving only
FROM ubuntu:14.04
MAINTAINER Maxwell Bates <maxwell.bates@autodesk.com>

RUN apt-get update
RUN apt-get install curl -y
RUN apt-get install git -y

#Node.js https://nodesource.com/blog/nodejs-v012-iojs-and-the-nodesource-linux-repositories
RUN curl -sL https://deb.nodesource.com/setup_0.12 | sudo bash -
RUN apt-get install -y nodejs

RUN npm install -g grunt-cli
RUN npm install -g bower
RUN npm install -g forever
RUN npm install -g nodemon@dev

ENV APP /app

COPY package.json /app/package.json
COPY app/scripts/omniprotocol /app/app/scripts/omniprotocol
RUN cd /app ; npm install

COPY bower.json /app/bower.json
RUN cd /app ; bower install --allow-root

COPY app /app/app
COPY files /app/files
COPY .travis.yml /app/.travis.yml
COPY Gruntfile.js /app/Gruntfile.js

COPY server /app/server
COPY CHECKS /app/CHECKS

WORKDIR /app

CMD npm run start
