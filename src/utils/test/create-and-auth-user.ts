import request from "supertest";
import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";
import { hash } from "bcryptjs";

export async function createAndAuthUser(app: FastifyInstance, isAdmin = false) {
  await prisma.user.create({
    data: {
      name: "John Doe",
      email: "jE2wZ@example.com",
      password_hash: await hash("123456", 6),
      role: isAdmin ? "ADMIN" : "MEMBER",
    }
  })

  const auth = await request(app.server).post("/sessions").send({
    email: "jE2wZ@example.com",
    password: "123456",
  });

  const { token } = auth.body;

  return { token };
}
