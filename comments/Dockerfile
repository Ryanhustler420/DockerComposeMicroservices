FROM node:14-alpine

# set your env here
ENV MONGO_URI=dbpath
ENV ENV=production
ENV PORT=3003

WORKDIR /app
COPY package*.json .

RUN npm install -g nodemon
RUN npm install

COPY . .
EXPOSE $PORT
CMD [ "npm", "start" ]