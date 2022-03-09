FROM node:17.5

WORKDIR /home/app
EXPOSE 8080

COPY . .
RUN yarn && yarn build
RUN yarn global add forever

CMD forever build/server.js
