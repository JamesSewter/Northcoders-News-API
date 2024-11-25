const { fetchArticle } = require("../models/api.article.model");

exports.getArticle = (req, res, next) => {
  const id = req.params.article_id;
  fetchArticle(id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
