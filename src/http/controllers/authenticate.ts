import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { ApiError } from "../../errors/ApiError";
import { STATUS_CODE } from "../../utils/status-code";
import { makeAuthenticateUseCase } from "../../use-cases/factories/make-authenticate-use-case";

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = authenticateBodySchema.parse(request.body);
  try {
    const authenticateUseCase = makeAuthenticateUseCase()

    await authenticateUseCase.execute({ email, password });
  } catch (e) {
    if (e instanceof ApiError){
      return reply.status(e?.statusCode).send({ message: e?.message });
    }
    return reply.status(STATUS_CODE.INTERNAL_SERVER_ERROR).send();
  }
  return reply.status(STATUS_CODE.OK).send();
}
