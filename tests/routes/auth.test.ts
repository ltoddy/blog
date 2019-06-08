import request from "supertest";

import app from "../../src/app";

describe("GET /auth/signup", () => {
  it("should return 200 OK", () => {
    return request(app)
      .get("/auth/signup")
      .expect(200);
  });
});

describe("GET /auth/signin", () => {
  it("should return 200 OK", () => {
    return request(app)
      .get("/auth/signin")
      .expect(200);
  });
});

describe("GET /auth/signout", () => {
  it("should return 302 OK", () => {
    return request(app)
      .get("/auth/signout")
      .expect(302);
  });
});
