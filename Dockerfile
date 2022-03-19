FROM node:17.5

WORKDIR /home/app
EXPOSE 8080

# Copy all project files
COPY . .

# Build typescript
RUN yarn && yarn build

# Remove unecessary files
RUN rm -rf ./node_modules ./src

# Install only production dependencies
RUN yarn --production

CMD yarn start
