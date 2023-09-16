const kafkaWrapper = require('./kafka/kafka-wrapper');
const prometheus = require('prom-client');
const express = require("express");
const axios = require('axios');
const app = express();

const metricsInterval = prometheus.collectDefaultMetrics();

// Create a counter metric
const counter = new prometheus.Counter({
  name: 'users_every_users_query',
  help: ':: Tells how many time a user asked for all the users details',
});

const httpRequestDurationMicroseconds = new prometheus.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.10, 5, 15, 50, 100, 200, 300, 400, 500]  // buckets for response time from 0.1ms to 500ms
});

// Runs before each requests
app.use((req, res, next) => {
  res.locals.startEpoch = Date.now()
  next()
});

app.get("/users", async (req, res) => {
  counter.inc();
  const all_users = await axios.get("https://jsonplaceholder.typicode.com/users");
  res.json(all_users.data);
});

app.get("/users/kafka/:message", async (req, res) => {
  const { message } = req.params;
  const producer = kafkaWrapper.kafka.producer();
  await producer.connect();
  await producer.send({ topic: 'users', messages: [{ value: message }] });
  res.json({ message });
});

app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  const user = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);
  res.json(user.data);
});

app.get("/metrics", async (req, res) => {
  res.set('Content-Type', prometheus.register.contentType)
  res.end(await prometheus.register.metrics())
});

// Runs after each requests
app.use((req, res, next) => {
  const responseTimeInMs = Date.now() - res.locals.startEpoch
  httpRequestDurationMicroseconds.labels(req.method, req.route.path, res.statusCode).observe(responseTimeInMs)
  next();
});

const start = async () => {
  try {
    const groupId = "users-api";
    kafkaWrapper.init(groupId, [process.env.KAFAK_1]);
    const consumer = kafkaWrapper.kafka.consumer({ groupId });
    await consumer.connect();
    await consumer.subscribe({ topic: "posts" });
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log(`Received message: ${message.value.toString()}`);
      },
    });
  } catch(err) { console.error(err); }

  const PORT = process.env.PORT || 3000;
  const HOST = '0.0.0.0';
  app.listen(PORT, HOST, () => {
    console.log(`Server is on http://${HOST}:${PORT}`);
  });
};

start();

// Graceful shutdown
process.on('SIGTERM', () => {
  clearInterval(metricsInterval)
  server.close((err) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    process.exit(0)
  });
});