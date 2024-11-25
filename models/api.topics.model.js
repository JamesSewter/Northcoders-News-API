const db = require("../db/connection");

exports.fetchTopics = () => {
  let sqlQuery = `SELECT * FROM topics `;
  const queryValues = [];

  return db.query(sqlQuery, queryValues).then(({ rows }) => {
    return rows;
  });
};
