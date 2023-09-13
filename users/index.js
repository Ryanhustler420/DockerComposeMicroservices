const express = require("express");
const axios = require('axios');
const app = express();

app.get("/users", async (req, res) => {
  const all_users = await axios.get("https://jsonplaceholder.typicode.com/users");
  res.json(all_users.data);
});

app.get("/users/:id", async (req, res) => {
  const { id } = req.params;

  const user = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);
  res.json(user.data);
});

app.listen(process.env.PORT, () => {
  console.log(`Server is up and listing on port ${process.env.PORT}`);
});