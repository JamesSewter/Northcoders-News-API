const db = require("../db/connection");

const validSortByColumns = [
  "article_id",
  "title",
  "author",
  "topic",
  "created_at",
  "votes",
];
const validOrders = ["asc", "desc"];

exports.fetchArticles = (sort_by = "created_at", order = "desc", topic) => {
  if (!validSortByColumns.includes(sort_by) && !validOrders.includes(order.toLowerCase())) {
    return Promise.reject({
      status: 400,
      msg: "Bad request - invalid order and sort_by column",
    });
  }
  if (!validSortByColumns.includes(sort_by)) {
    return Promise.reject({
      status: 400,
      msg: "Bad request - invalid sort_by column",
    });
  }
  if (!validOrders.includes(order.toLowerCase())) {
    return Promise.reject({ status: 400, msg: "Bad request - invalid order" });
  }

  let sqlQuery = `SELECT articles.article_id, articles.title, articles.author, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
COUNT(comments.comment_id) AS comment_count 
FROM articles
LEFT JOIN comments 
ON comments.article_id = articles.article_id `;
  const queryValues = [];

  if (topic) {
    sqlQuery += `WHERE articles.topic = $1 `;
    queryValues.push(topic);
  }

  sqlQuery += `GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`;

  return db.query(sqlQuery, queryValues).then(({ rows }) => {
    if (topic && rows.length === 0) {
      return db
        .query(`SELECT * FROM topics WHERE slug = $1`, [topic])
        .then(({ rows: topicRows }) => {
          if (topicRows.length === 0) {
            return Promise.reject({ status: 404, msg: "Not found" });
          }
          return [];
        });
    }
    return rows;
  });
};
