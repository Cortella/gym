import { FastifyRequest, FastifyReply } from "fastify";
import { ApiError } from "../../errors/ApiError";
import { STATUS_CODE } from "../../utils/status-code";
import { makeRegisterUseCase } from "../../use-cases/factories/make-register-use-case";
import { z } from "zod";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { name, email, password } = registerBodySchema.parse(request.body);
  try {
    const registerUseCase = makeRegisterUseCase();

    await registerUseCase.execute({ email, name, password });
  } catch (e) {
    if (e instanceof ApiError) {
      return reply.status(e?.statusCode).send({ message: e?.message });
    }
    return reply.status(STATUS_CODE.INTERNAL_SERVER_ERROR).send();
  }
  return reply.status(STATUS_CODE.CREATED).send();
}
