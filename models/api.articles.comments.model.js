const db = require("../db/connection");

exports.fetchArticlesComments = (article_id) => {
  const sqlQuery = `SELECT * FROM comments WHERE article_id = $1 ORDER BY comments.created_at DESC;`;
  const queryValues = [article_id];

  return db.query(sqlQuery, queryValues).then(({ rows }) => {
    return rows;
  });
};

exports.fetchArticleById = (article_id) => {
  const sqlQuery = `SELECT * FROM articles WHERE article_id = $1 `;
  const queryValues = [article_id];

  return db.query(sqlQuery, queryValues).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({
        status: 404,
        msg: "Error - not found",
      });
    }
  });
};
