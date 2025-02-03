import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { ApiError } from "../../../errors/ApiError";
import { STATUS_CODE } from "../../../utils/status-code";
import { makeSearchGymsUseCase } from "../../../use-cases/factories/make-search-gyms-use-case";

export async function searchGymController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const searchGymBodySchema = z.object({
    q: z.string(),
    page: z.coerce.number().min(1).default(1),
  });

  const { q, page } = searchGymBodySchema.parse(request.body);
  try {
    const searchGymUseCase = makeSearchGymsUseCase();

    const { gyms } = await searchGymUseCase.execute({
      query: q,
      page,
    });

    return reply.status(STATUS_CODE.OK).send(gyms);
  } catch (e) {
    if (e instanceof ApiError) {
      return reply.status(e?.statusCode).send({ message: e?.message });
    }
    return reply.status(STATUS_CODE.INTERNAL_SERVER_ERROR).send();
  }
}
