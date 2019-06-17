import request = require("supertest");

import app from "../../src/app";

describe("GET /", () => {
  it("should return 200 OK", () => {
    return request(app)
      .get("/")
      .expect(200);
  });
});
