FROM ubuntu:14.04
MAINTAINER Dion Whitehead Amago <dion.amago@autodesk.com>

ENV PORT 9000

ENV appFolder /cx1

RUN apt-get update
RUN apt-get install curl -y
RUN apt-get install git -y

RUN curl -sL https://deb.nodesource.com/setup_0.12 | sudo bash -
RUN apt-get install -y nodejs

RUN mkdir $appFolder
WORKDIR $appFolder

ADD package.json $appFolder/package.json
ADD app/scripts/omniprotocol $appFolder/app/scripts/omniprotocol
RUN cd $appFolder; npm install


RUN npm install -g grunt-cli

ADD bower.json $appFolder/bower.json
RUN npm install -g bower
RUN bower install --allow-root

# RUN grunt serve

EXPOSE 9000

ADD . $appFolder

CMD ["grunt", "serve"]

