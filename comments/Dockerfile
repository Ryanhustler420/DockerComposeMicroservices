FROM node:14-alpine

ENV ENV=production

# set your env here
ENV KAFAK_1=kafka:9092
ENV MONGO_URI=dbpath
ENV PORT=3003

WORKDIR /app
COPY package*.json .

RUN npm install -g nodemon
RUN npm install

COPY . .
EXPOSE $PORT
CMD [ "npm", "start" ]