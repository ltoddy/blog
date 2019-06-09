import request = require("supertest");

import app from "../../src/app";

describe("GET /posts", () => {
  it("should return 200 OK", () => {
    return request(app)
      .get("/posts")
      .expect(200);
  });
});
