FROM node:10.15.1-alpine

WORKDIR /home/node/app

COPY package.json ./

RUN yarn --ignore-optional

USER node

EXPOSE 3000

CMD ["yarn", "start"]
