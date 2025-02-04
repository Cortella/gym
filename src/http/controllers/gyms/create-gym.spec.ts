import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "../../../app";
import request from "supertest";
import { STATUS_CODE } from "../../../utils/status-code";
import { createAndAuthUser } from "../../../utils/test/create-and-auth-user";

describe("Create Gym (e2e)", () => {
  beforeAll(async () => {
    app.ready();
  });
  afterAll(() => {
    app.close();
  });

  it("should be able to create a gym", async () => {
    const { token } = await createAndAuthUser(app, true);
    const response = await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Academia",
        description: "Academia de programação",
        phone: "11999999999",
        latitude: -27.2092052,
        longitude: -49.6401091
      });

    expect(response.statusCode).toEqual(STATUS_CODE.OK);
  });
});
