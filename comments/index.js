const kafkaWrapper = require('./kafka/kafka-wrapper');
const prometheus = require('prom-client');
const express = require("express");
const axios = require("axios");
const app = express();

const metricsInterval = prometheus.collectDefaultMetrics();

// Create a counter metric
const counter = new prometheus.Counter({
  name: 'comments_every_users_query',
  help: ':: Tells how many time a user asked for all the comments details',
});

// Runs before each requests
app.use((req, res, next) => {
  res.locals.startEpoch = Date.now()
  next()
});

app.get("/comments", async (req, res) => {
  counter.inc();
  const all_comments = await axios.get("https://jsonplaceholder.typicode.com/comments");
  res.json(all_comments.data);
});

app.get("/comments/kafka/:message", async (req, res) => {
  const { message } = req.params;
  const producer = kafkaWrapper.kafka.producer();
  await producer.connect();
  await producer.send({ topic: 'comments', messages: [{ value: message }] });
  res.json({ message });
});

app.get("/comments/post/:postid", async (req, res) => {
  const { postid } = req.params;
  const post_comments = await axios.get(`https://jsonplaceholder.typicode.com/comments?postId=${postid}`);
  res.json(post_comments.data);
});

app.get("/comments/:id", async (req, res) => {
  const { id } = req.params;
  const post_comments = await axios.get(`https://jsonplaceholder.typicode.com/comments?id=${id}`);
  res.json(post_comments.data);
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
    kafkaWrapper.init("comments-api", ["kafka:9092"]);
    const consumer = kafkaWrapper.kafka.consumer({ groupId: 'comments-api' });
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