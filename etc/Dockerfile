FROM ubuntu:14.04
MAINTAINER Dion Whitehead Amago <dion.amago@autodesk.com>

RUN apt-get update
RUN apt-get install curl -y
RUN apt-get install git -y

#Node.js https://nodesource.com/blog/nodejs-v012-iojs-and-the-nodesource-linux-repositories
RUN curl -sL https://deb.nodesource.com/setup_0.12 | sudo bash -
RUN apt-get install -y nodejs

RUN npm install -g grunt-cli
RUN npm install -g bower
RUN npm install -g nodemon
RUN npm install -g bunyan
