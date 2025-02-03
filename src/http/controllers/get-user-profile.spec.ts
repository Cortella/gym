import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "../../app";
import request from "supertest";
import { STATUS_CODE } from "../../utils/status-code";

describe("Authenticate (e2e)", () => {
  beforeAll(async () => {
    app.ready();
  });
  afterAll(() => {
    app.close();
  });
  
  it("should be able to Authenticate", async () => {
    const account = await request(app.server).post("/users").send({
      name: "John Doe",
      email: "jE2wZ@example.com",
      password: "123456",
    });

    const auth = await request(app.server).post("/sessions").send({
      email: "jE2wZ@example.com",
      password: "123456",
    });

    const { token } = auth.body

    const response = await request(app.server).get('/me').set('Authorization', `Bearer ${token}`).send()

    expect(response.statusCode).toEqual(STATUS_CODE.OK);
    expect(response.body.user).toEqual(expect.objectContaining({
      email: "jE2wZ@example.com"
    }));
  });
});
