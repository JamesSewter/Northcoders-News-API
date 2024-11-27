const { fetchArticles } = require("../models/api.articles.model");

const validSortByColumns = [
  "article_id",
  "title",
  "author",
  "topic",
  "created_at",
  "votes",
];
const validOrders = ["asc", "desc"];

exports.getArticles = (req, res, next) => {
  if (req.query.sort_by) {
    sort_by = req.query.sort_by;
  } else {
    sort_by = "created_at"
  }
  if (req.query.order) {
    order = req.query.order
  } else {
    order = "desc"
  }
  
  if (!validSortByColumns.includes(sort_by) && !validOrders.includes(order.toLowerCase())) {
    return res
      .status(400)
      .send({ msg: "Bad request - invalid order and sort_by column" });
  }
  if (!validSortByColumns.includes(sort_by)) {
    return res
      .status(400)
      .send({ msg: "Bad request - invalid sort_by column" });
  }
  if (!validOrders.includes(order.toLowerCase())) {
    return res.status(400).send({ msg: "Bad request - invalid order" });
  }

  fetchArticles(sort_by, order)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
