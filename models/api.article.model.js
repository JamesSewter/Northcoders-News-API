const db = require("../db/connection");

exports.fetchArticle = (id) => {
   if (isNaN(id)) {
    return Promise.reject({
      status: 400,
      msg: "Error - bad request, invalid article_id",
    });
  } 
  const sqlQuery = `SELECT * FROM articles WHERE article_id = $1 `;
  const queryValues = [id];

  return db.query(sqlQuery, queryValues).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "Error - article not found" });
    }
    return rows[0];
  });
};
