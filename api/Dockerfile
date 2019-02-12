FROM node:10.15.1-alpine

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH $NPM_CONFIG_PREFIX/bin:$PATH
RUN npm i -g nodemon

RUN mkdir /home/node/api
WORKDIR /home/node/api

COPY package.json ./
RUN npm i --no-optional
RUN mv /home/node/api/node_modules/ /home/node/

USER node
EXPOSE 3031

CMD ["npm", "start"]
