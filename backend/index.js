const express = require("express");
const app = express();
const port = 80;

app.get("/api/hello", (req, res) => {
  res.cookie("id", "4444");
  res.send("2198738927");
});

app.get("/api/*", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
