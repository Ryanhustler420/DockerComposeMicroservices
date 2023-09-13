const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const prometheus = require('prom-client');
const redisAdapter = require("socket.io-redis");

const app = express();
const server = http.createServer(app);

const metricsInterval = prometheus.collectDefaultMetrics();

// Create a counter metric
const counter = new prometheus.Counter({
  name: 'votings_every_users_query',
  help: ':: Tells how many time a user asked for all the votings details',
});

const io = socketIO(server, { path: "/votings/socket" });
io.adapter(redisAdapter({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT }));

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Runs before each requests
app.use((req, res, next) => {
  res.locals.startEpoch = Date.now()
  next()
});

app.get("/votings", async (req, res) => {
  counter.inc();
  res.json({
    service: "votings service",
  });
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

server.listen(PORT, () => {
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