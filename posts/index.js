const kafkaWrapper = require('./kafka/kafka-wrapper');
const prometheus = require('prom-client');
const express = require("express");
const axios = require("axios");
const app = express();

const metricsInterval = prometheus.collectDefaultMetrics();

// Create a counter metric
const counter = new prometheus.Counter({
  name: 'posts_every_users_query',
  help: ':: Tells how many time a user asked for all the posts details',
});

// Runs before each requests
app.use((req, res, next) => {
  res.locals.startEpoch = Date.now()
  next()
});

app.get("/posts", async (req, res) => {
  counter.inc();
  const posts = await axios.get("https://jsonplaceholder.typicode.com/posts");
  res.json(posts.data);
});

app.get("/posts/kafka/:message", async (req, res) => {
  const { message } = req.params;
  const producer = kafkaWrapper.kafka.producer();
  await producer.connect();
  await producer.send({ topic: 'posts', messages: [{ value: message }] });
  res.json({ message });
});

app.get("/posts/:id", async (req, res) => {
  const { id } = req.params;
  const post = await axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`);
  res.json(post.data);
});

app.get("/metrics", async (req, res) => {
  res.set('Content-Type', prometheus.register.contentType)
  res.end(await prometheus.register.metrics())
});

// Runs after each requests
app.use((req, res, next) => {
  const responseTimeInMs = Date.now() - res.locals.startEpoch
  next();
});

const start = async () => {
  try {
    const groupId = "posts-api";
    kafkaWrapper.init(groupId, [process.env.KAFAK_1]);
    const consumer = kafkaWrapper.kafka.consumer({ groupId });
    await consumer.connect();
    await consumer.subscribe({ topic: "votings" });
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