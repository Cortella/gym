import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "../../../app";
import request from "supertest";
import { STATUS_CODE } from "../../../utils/status-code";

describe("Register (e2e)", () => {
  beforeAll(async () => {
    app.ready();
  });
  afterAll(() => {
    app.close();
  });

  it("should be able to register", async () => {
    const response = await request(app.server).post("/users").send({
      name: "John Doe",
      email: "jE2wZ@example.com",
      password: "123456",
    });

    expect(response.statusCode).toEqual(STATUS_CODE.CREATED);
  });
});
