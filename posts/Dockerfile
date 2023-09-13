FROM node:14-alpine

# set your env here
ENV ENV=production
ENV PORT=3002

WORKDIR /app
COPY package*.json .

RUN npm install

COPY . .
EXPOSE 3002
CMD [ "npm", "start" ]