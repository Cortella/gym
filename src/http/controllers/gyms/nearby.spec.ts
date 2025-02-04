import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "../../../app";
import request from "supertest";
import { STATUS_CODE } from "../../../utils/status-code";
import { createAndAuthUser } from "../../../utils/test/create-and-auth-user";

describe("Nearby Gyms (e2e)", () => {
  beforeAll(async () => {
    app.ready();
  });
  afterAll(() => {
    app.close();
  });

  it("should be able to Nearby Gyms", async () => {
    const { token } = await createAndAuthUser(app, true);

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "JS Academia",
        description: "Academia de programação",
        phone: "11999999999",
        latitude: -27.2092052,
        longitude: -49.6401091
      });

      await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "TS Academia",
        description: "Academia de programação",
        phone: "11999999999",
        latitude: 27.2092052,
        longitude: 49.6401091
      });

    const response = await request(app.server)
      .get("/gyms/nearby")
      .query({ latitude: -27.2092052, longitude: -49.6401091 })
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(STATUS_CODE.OK);
    expect(response.body).toHaveLength(1);
    expect(response.body).toEqual([
      expect.objectContaining({
        title: "JS Academia"
      })
    ])
  });
});
