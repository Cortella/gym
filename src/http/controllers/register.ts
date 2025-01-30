import { FastifyRequest, FastifyReply } from "fastify";
import { PrismaUsersRepository } from "../../repositories/prisma/prisma-users-repository";
import { z } from "zod";
import { RegisterUseCase } from "../../use-cases/registerUseCase";
import { Prisma } from "@prisma/client";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { name, email, password } = registerBodySchema.parse(request.body);
  try {
    const prismaUsersRepository = new PrismaUsersRepository();
    const registerUseCase = new RegisterUseCase(prismaUsersRepository);

    await registerUseCase.execute({ email, name, password });
  } catch (e) {
    return reply.status(409).send();
  }
  return reply.status(201).send();
}
