FROM node:10.15.1-alpine

RUN yarn global add nodemon

WORKDIR /home/node/api

COPY package.json ./

RUN yarn --ignore-optional

USER node

EXPOSE 3031

CMD ["yarn", "start"]
