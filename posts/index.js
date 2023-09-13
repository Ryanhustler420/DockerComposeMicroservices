const express = require("express");
const axios = require("axios");
const app = express();

app.get("/posts", async (req, res) => {
  const posts = await axios.get("https://jsonplaceholder.typicode.com/posts");
  res.json(posts.data);
});

app.get("/posts/:id", async (req, res) => {
  const { id } = req.params;
  const post = await axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`);
  res.json(post.data);
});

app.listen(process.env.PORT, () => {
  console.log(`Server is up and listing on port ${process.env.PORT}`);
});