import request from "supertest";

import app from "../src/app";

describe("GET /random-url", () => {
  it("should return 404", () => {
    return request(app)
      .get("/random-url")
      .expect(404);
  });
});
