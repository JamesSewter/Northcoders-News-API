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
  test("404: Responds with a not found error msg for when an attempt to use an valid path that does not exist", () => {
    return request(app)
      .get("/api/topicsssss")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Error - not found");
      });
  });
});
