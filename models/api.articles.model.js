const db = require("../db/connection");

exports.fetchArticles = (sort_by = "created_at", order = "desc") => {
  let sqlQuery = `SELECT articles.article_id, articles.title, articles.author, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
COUNT(comments.comment_id) AS comment_count 
FROM articles
LEFT JOIN comments 
ON comments.article_id = articles.article_id
GROUP BY articles.article_id ORDER BY ${sort_by} ${order} `;

  return db.query(sqlQuery).then(({ rows }) => {
    return rows;
  });
};
