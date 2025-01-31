import { FastifyRequest, FastifyReply } from "fastify";
import { PrismaUsersRepository } from "../../repositories/prisma/prisma-users-repository";
import { z } from "zod";
import { RegisterUseCase } from "../../use-cases/registerUseCase";
import { Prisma } from "@prisma/client";
import { ApiError } from "../../errors/ApiError";
import { STATUS_CODE } from "../../utils/status-code";

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
    if (e instanceof ApiError){
      return reply.status(e?.statusCode).send({ message: e?.message });
    }
    return reply.status(STATUS_CODE.INTERNAL_SERVER_ERROR).send();
  }
  return reply.status(STATUS_CODE.CREATED).send();
}
