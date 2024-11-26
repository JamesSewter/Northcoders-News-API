const db = require("../db/connection");

exports.fetchArticlesComments = (article_id) => {
  const sqlQuery = `SELECT * FROM comments WHERE article_id = $1 ORDER BY comments.created_at DESC;`;
  const queryValues = [article_id];

  return db.query(sqlQuery, queryValues).then(({ rows }) => {
    return rows;
  });
};

exports.checkArticleById = (article_id) => {
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

exports.insertComment = (article_id, username, body) => {
  const sqlQuery = `INSERT INTO comments (body, votes, author, article_id, created_at) 
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *;`
  const queryValues = [body, 0, username, article_id, new Date]

  return db.query(sqlQuery, queryValues).then(({rows}) => {
    return rows[0]
  })
}
