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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is up and listing on port ${PORT}`);
});

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