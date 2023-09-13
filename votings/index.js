const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const redisAdapter = require("socket.io-redis");

const app = express();
const server = http.createServer(app);

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

app.get("/votings", async (req, res) => {
  res.json({
    service: "votings service",
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Server is up and listing on port ${process.env.PORT}`);
});