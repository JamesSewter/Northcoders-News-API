const { fetchArticles } = require("../models/api.articles.model");

exports.getArticles = (req, res, next) => {
  fetchArticles().then((articles) => {
    res.status(200).send({articles});
  }) .catch((err) => {
    next(err);
  });
};
 