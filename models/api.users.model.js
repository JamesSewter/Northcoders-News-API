const db = require("../db/connection");

exports.fetchUsers = () => {
  let sqlQuery = `SELECT * FROM users `;
  return db.query(sqlQuery).then(({ rows }) => {
    return rows;
  });
};
