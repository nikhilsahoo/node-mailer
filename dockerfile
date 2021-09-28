FROM node:16.10-stretch

RUN npm install -g maildev nodemon

RUN mkdir /home/node/node-mailer

WORKDIR /home/node/node-mailer/

ADD ./config /home/node/node-mailer/config

ADD ./index.js /home/node/node-mailer/

ADD ./package.json /home/node/node-mailer/

ADD ./startup.sh /home/node/node-mailer/

ENV NODE_EVN="development"

RUN npm install

EXPOSE 1080

EXPOSE 1025

EXPOSE 5000

ENTRYPOINT ["/bin/bash","-c","./startup.sh"]
