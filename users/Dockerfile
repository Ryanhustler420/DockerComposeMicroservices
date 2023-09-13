FROM node:14-alpine

ENV ENV=production

# set your env here
ENV MONGO_URI=dbpath
ENV PORT=3001

WORKDIR /app
COPY package*.json .

RUN npm install -g nodemon
RUN npm install

COPY . .
EXPOSE $PORT
CMD [ "npm", "start" ]