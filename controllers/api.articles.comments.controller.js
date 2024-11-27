const {
  fetchArticlesComments,
  checkArticleById,
  insertComment,
  checkCommentExists,
  removeComment,
} = require("../models/api.articles.comments.model");

exports.getArticlesComments = (req, res, next) => {
  const article_id = req.params.article_id;
  if (isNaN(article_id)) {
    return next({
      status: 400,
      msg: "Error - bad request, invalid article_id",
    });
  }
  checkArticleById(article_id)
    .then(() => fetchArticlesComments(article_id))
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const { username, body } = req.body;
  //Validate username and body
  if (!username || !body) {
    return next({ status: 400, msg: "Error - username and body are required" });
  }
  if (typeof username !== "string" || typeof body !== "string") {
    return next({ status: 400, msg: "Error - invalid data type" });
  }
  //Verify article_id exists
  const article_id = req.params.article_id;
  if (isNaN(article_id)) {
    return next({
      status: 400,
      msg: "Error - bad request, invalid article_id",
    });
  }
  checkArticleById(article_id).then(() =>
    insertComment(article_id, username, body).then((comment) => {
      res.status(201).send({ comment });
    })
  );
};

exports.deleteComment = (req, res, next) => {
  const comment_id = req.params.comment_id;
  if (isNaN(comment_id)) {
    return next({
      status: 400,
      msg: "Error - invalid comment_id",
    });
  }
  checkCommentExists(comment_id)
    .then(() => {
      removeComment(comment_id).then(() => {
        res.status(204).send();
      });
    })
    .catch(next);
};
