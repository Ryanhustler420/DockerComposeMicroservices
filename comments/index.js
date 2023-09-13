const express = require("express");
const axios = require("axios");
const app = express();

app.get("/comments", async (req, res) => {
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

app.listen(process.env.PORT, () => {
  console.log(`Server is up and listing on port ${process.env.PORT}`);
});
