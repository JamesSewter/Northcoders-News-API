const express = require("express");
const { getApi } = require("./controllers/api.controller");
const { getTopics } = require("./controllers/api.topics.controller");
const app = express();

app.get("/api", getApi);

app.get("/api/topics", getTopics);

//Error handling
app.use((req, res, next) => {
  res.status(404).send({ msg: "Error - not found" });
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    res.status(500).send({ msg: "Internal server error" });
  }
});

module.exports = app;
