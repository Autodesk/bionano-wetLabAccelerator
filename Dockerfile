FROM ubuntu:14.04
MAINTAINER Dion Whitehead Amago <dion.amago@autodesk.com>

RUN apt-get update
RUN pwd; apt-get install curl -y

RUN curl -sL https://deb.nodesource.com/setup_0.12 | sudo bash -
RUN apt-get install -y nodejs
RUN npm install node-sass
RUN npm install -g grunt-cli
RUN npm install -g bower
RUN pwd
#ADD package.json package.json
#RUN apt-get update
#RUN pwd && ls -ls && npm install



# RUN grunt serve

EXPOSE 9000
ENV PORT=9000

