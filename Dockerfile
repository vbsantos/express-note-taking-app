FROM node:17.5

WORKDIR /home/app
EXPOSE 5000

COPY . .
RUN yarn && yarn build

CMD ["yarn", "start"]
