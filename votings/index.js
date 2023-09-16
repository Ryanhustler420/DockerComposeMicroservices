const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const prometheus = require('prom-client');
const redisAdapter = require("socket.io-redis");
const kafkaWrapper = require('./kafka/kafka-wrapper');

const app = express();
const server = http.createServer(app);

const metricsInterval = prometheus.collectDefaultMetrics();

// Create a counter metric
const counter = new prometheus.Counter({
  name: 'votings_every_users_query',
  help: ':: Tells how many time a user asked for all the votings details',
});

const io = socketIO(server, { path: process.env.SOCKET_IO_PATH });
io.adapter(redisAdapter({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT }));

io.on("connection", (socket) => {
  console.log('An user connected');

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

const start = async () => {
  try {
    const groupId = "votings-api";
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
  server.listen(PORT, HOST, () => {
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