const {
  fetchArticlesComments,
  fetchArticleById,
} = require("../models/api.articles.comments.model");

exports.getArticlesComments = (req, res, next) => {
  const article_id = req.params.article_id;
  if (isNaN(article_id)) {
    return next({
      status: 400,
      msg: "Error - bad request, invalid article_id",
    });
  }

  fetchArticleById(article_id)
    .then(() => fetchArticlesComments(article_id))
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};
