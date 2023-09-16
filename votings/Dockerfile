FROM node:14-alpine

ENV ENV=production

# set your env here
ENV SOCKET_IO_PATH=/votings/socket
ENV KAFAK_1=kafka:9092
ENV MONGO_URI=dbpath
ENV PORT=3004
ENV REDIS_HOST=localhost
ENV REDIS_PORT=6379

WORKDIR /app
COPY package*.json .

RUN npm install -g nodemon
RUN npm install

COPY . .
EXPOSE $PORT
CMD [ "npm", "start" ]