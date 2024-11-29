const db = require("../db/connection");

exports.fetchArticle = (id) => {
  if (isNaN(id)) {
    return Promise.reject({
      status: 400,
      msg: "Error - bad request, invalid article_id",
    });
  }
  const sqlQuery = `SELECT articles.article_id, articles.title, articles.author, articles.body, 
           articles.topic, articles.created_at, articles.votes, articles.article_img_url,
           COUNT(comments.comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id `;
  const queryValues = [id];

  return db.query(sqlQuery, queryValues).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "Error - article not found" });
    }
    return rows[0];
  });
};

exports.checkArticleExists = (article_id) => {
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

exports.updateArticleVotes = (article_id, inc_votes) => {
  const sqlQuery = `
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *;`;
  const queryValues = [inc_votes, article_id];

  return db.query(sqlQuery, queryValues).then(({ rows }) => {
    return rows[0];
  });
};
