FROM node:alpine

RUN apk add yarn 
RUN yarn global add serve

RUN mkdir /app

COPY ./build /app/build

WORKDIR /app

ENTRYPOINT  ["serve","-l", "tcp://127.0.0.1:5000", "-s","build"]
