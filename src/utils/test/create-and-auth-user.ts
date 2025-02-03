import request from "supertest";
import { FastifyInstance } from "fastify";

export async function createAndAuthUser(app: FastifyInstance) {
  await request(app.server).post("/users").send({
    name: "John Doe",
    email: "jE2wZ@example.com",
    password: "123456",
  });

  const auth = await request(app.server).post("/sessions").send({
    email: "jE2wZ@example.com",
    password: "123456",
  });

  const { token } = auth.body;

  return { token };
}
