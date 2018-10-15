FROM node:alpine

RUN apk add yarn 
RUN yarn global add serve

RUN mkdir /app

COPY ./build /app/build

WORKDIR /app

ENTRYPOINT  ["serve", "-s","build"]
