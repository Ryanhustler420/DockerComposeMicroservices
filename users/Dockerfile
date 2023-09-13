FROM node:14-alpine

# set your env here
ENV ENV=production
ENV PORT=3001

WORKDIR /app
COPY package*.json .

RUN npm install

COPY . .
EXPOSE 3001
CMD [ "npm", "start" ]