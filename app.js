const express = require("express");
const { getApi } = require("./controllers/api.controller");
const { getTopics } = require("./controllers/api.topics.controller");
const {getArticle} = require("./controllers/api.article.controller")
const {getArticles} = require("./controllers/api.articles.controller")
const {getArticlesComments, postComment} = require("./controllers/api.articles.comments.controller")

const app = express();

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/article/:article_id", getArticle)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id/comments", getArticlesComments)

app.use(express.json());
app.post("/api/articles/:article_id/comments", postComment)

app.use((req, res, next) => {
    res.status(404).send({ msg: "Error - not found" });
  } );

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    res.status(500).send({ msg: "Internal server error" });
  }
}); 

module.exports = app;
