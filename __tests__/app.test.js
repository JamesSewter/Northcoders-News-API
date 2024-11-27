const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const app = require("../app");

/* Set up your test imports here */
const endpointsJson = require("../endpoints.json");
const topics_test = require("../db/data/test-data/topics");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an array of topic objects, each of which should have slug and description properties:", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics).toEqual(topics_test);
      });
  });
  test("404: Responds with a not found error msg for an attempt to use an valid path that does not exist", () => {
    return request(app)
      .get("/api/topicsssss")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Not found");
      });
  });
});

describe("GET /api/article/article_id", () => {
  test("200: Responds with an article object, which should have the following properties: author, title, article_id, body, topic, created_at, votes, article_img_url", () => {
    return request(app)
      .get("/api/article/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });
  test("400: Responds with a 'bad request' error msg for an attempt to use an invalid path", () => {
    return request(app)
      .get("/api/article/notAnId")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Error - bad request, invalid article_id");
      });
  });
  test("404: Responds with a 'not found' error msg for an attempt to use an valid path that does not exist in the (test) database", () => {
    return request(app)
      .get("/api/article/999")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Error - article not found");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: Responds with: an articles array of article objects with properties: author, title, article_id, topic, created_at, votes, article_img_url, and comment_count. The articles should be sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
          expect(article).not.toHaveProperty("body");
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
      });
  });
  test("404: Responds with a 'not found' error msg for an attempt to use an valid path that does not exist ", () => {
    return request(app)
      .get("/api/articles_path_does_not_exist")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Not found");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of comments for the given article_id of which each comment should have the following properties:comment_id, votes, created_at, author, body, article_id. Comments should be served with the most recent comments first.", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          });
        });
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("200: Responds with an empty array for an article with no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toEqual([]);
      });
  });
  test("400: Responds with a 'bad request' error msg for an attempt to use an invalid path", () => {
    return request(app)
      .get("/api/articles/not_an_id/comments")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Error - bad request, invalid article_id");
      });
  });
  test("404: Responds with a 'not found' error msg for an attempt to use an valid path that does not exist ", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Error - not found");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Responds with the posted comment", () => {
    const newComment = {
      username: "rogersop",
      body: "The sixth sick sheik's sixth sheep's sick",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toMatchObject({
          body: "The sixth sick sheik's sixth sheep's sick",
          votes: expect.any(Number),
          author: "rogersop",
          article_id: 1,
          created_at: expect.any(String),
        });
      });
  });
  test("400: Respond with bad request error msg for when missing username/body in new comment", () => {
    const newComment = {
      username: "",
      body: "The sixth sick sheik's sixth sheep's sick",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Error - username and body are required");
      });
  });
  test("400: Respond with bad request error msg for when username/body are invalid (not strings)", () => {
    const newComment = {
      username: 12312,
      body: 314273981,
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Error - invalid data type");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: Updates the votes for a specified article by a value 'newVote'. Responds with the updated article.", () => {
    const newVote = 20;
    const voteObj = { inc_votes: newVote };
    return request(app)
      .patch("/api/articles/1")
      .send(voteObj)
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 120,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("400: Respond with bad request error msg for when voteObj does not have a inc_votes key and value", () => {
    const voteObj = {};
    return request(app)
      .patch("/api/articles/1")
      .send(voteObj)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Error - invalid voteObj (no inc_votes present)");
      });
  });
  test("400: Respond with bad request error msg for when voteObj's inc_votes value is invalid", () => {
    const newVote = "ImNotANumber:(";
    const voteObj = { inc_votes: newVote };
    return request(app)
      .patch("/api/articles/1")
      .send(voteObj)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Error - invalid voteObj");
      });
  });
  test("404: Respond with not found error msg for when article_id does not exist", () => {
    const newVote = 20;
    const voteObj = { inc_votes: newVote };
    return request(app)
      .patch("/api/articles/999")
      .send(voteObj)
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Error - not found");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: Deletes the specified comment and responds with no content", () => {
    const comment_id = 1;
    return request(app)
      .delete(`/api/comments/${comment_id}`)
      .expect(204)
      .then(() => {
        const sqlQuery = `SELECT * FROM comments WHERE comment_id = $1`;
        const queryValues = [comment_id];
        return db.query(sqlQuery, queryValues).then(({ rows }) => {
          expect(rows).toHaveLength(0);
        });
      });
  });
  test("400: Respond with bad request error msg for when comment_id is invalid", () => {
    const comment_id = "notANumber";
    return request(app)
      .delete(`/api/comments/${comment_id}`)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Error - invalid comment_id");
      });
  });
  test("404: Respond with not found error msg for when comment_id does not exist", () => {
    const comment_id = 999;
    return request(app)
      .delete(`/api/comments/${comment_id}`)
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Error - comment not found");
      });
  });
});

describe("GET /api/users", () => {
  test("200: Responds with an array of user objects, each user object should have the following properties: username, name, avatar_url", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
  test("404: Respond with not found error msg for an non-existing end point", () => {
    return request(app)
      .get("/api/not-a-route")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Not found");
      });
  });
});
