FROM node:14-alpine

# set your env here
ENV ENV=production
ENV PORT=3003

WORKDIR /app
COPY package*.json .

RUN npm install

COPY . .
EXPOSE 3003
CMD [ "npm", "start" ]