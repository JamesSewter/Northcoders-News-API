const cors = require('cors');
const express = require("express");
const { getApi } = require("./controllers/api.controller");
const { getTopics } = require("./controllers/api.topics.controller");
const {
  getArticle,
  patchArticleVotes,
} = require("./controllers/api.article.controller");
const { getArticles } = require("./controllers/api.articles.controller");
const {
  getArticlesComments,
  postComment,
  deleteComment,
} = require("./controllers/api.articles.comments.controller");
const { getUsers } = require("./controllers/api.users.controller");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/article/:article_id", getArticle);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getArticlesComments);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchArticleVotes);

app.delete("/api/comments/:comment_id", deleteComment);

app.get("/api/users", getUsers);

app.use((req, res, next) => {
  res.status(404).send({ msg: "Not found" });
});

//postgresErrHandler
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "Not found" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    res.status(500).send({ msg: "Internal server error" });
  }
});

module.exports = app;
