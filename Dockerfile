FROM ubuntu:14.04
MAINTAINER Dion Whitehead Amago <dion.amago@autodesk.com>

ENV appFolder /cx1

RUN apt-get update
RUN apt-get install curl -y
RUN apt-get install git -y

RUN curl -sL https://deb.nodesource.com/setup_0.12 | sudo bash -
RUN apt-get install -y nodejs

RUN mkdir $appFolder

ADD package.json $appFolder/package.json
ADD app/scripts/omniprotocol $appFolder/app/scripts/omniprotocol
RUN cd $appFolder; npm install

#RUN npm install node-sass
#RUN npm install -g grunt-cli
#RUN npm install -g bower

# RUN grunt serve

EXPOSE 9000
ENV PORT=9000

WORKDIR $appFolder
ADD . $appFolder

CMD ["grunt", "serve"]

