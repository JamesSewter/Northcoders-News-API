const {
  fetchArticle,
  checkArticleExists,
  updateArticleVotes,
} = require("../models/api.article.model");

exports.getArticle = (req, res, next) => {
  const id = req.params.article_id;
  fetchArticle(id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleVotes = (req, res, next) => {
  const { inc_votes } = req.body;

  if (!inc_votes) {
    return next({
      status: 400,
      msg: "Error - invalid voteObj (no inc_votes present)",
    });
  }
  if (typeof inc_votes !== "number") {
    return next({ status: 400, msg: "Error - invalid voteObj" });
  }

  const article_id = req.params.article_id;

  if (isNaN(article_id)) {
    return next({
      status: 400,
      msg: "Error - bad request, invalid article_id",
    });
  }

  checkArticleExists(article_id)
    .then(() => {
      updateArticleVotes(article_id, inc_votes).then((article) => {
        res.status(200).send({ article });
      });
    })
    .catch(next);
};
