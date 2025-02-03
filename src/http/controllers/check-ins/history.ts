import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { ApiError } from "../../../errors/ApiError";
import { STATUS_CODE } from "../../../utils/status-code";
import { makeFetchUserCheckInsHistoryUseCase } from "../../../use-cases/factories/make-fetch-user-check-ins-history-use-case";

export async function HistoryController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const historyBodySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  });

  const { page } = historyBodySchema.parse(request.query);
  try {
    const historyUseCase = makeFetchUserCheckInsHistoryUseCase();

    const { checkIns } = await historyUseCase.execute({
      userId: request.user.sub,
      page,
    });

    return reply.status(STATUS_CODE.OK).send(checkIns);
  } catch (e) {
    if (e instanceof ApiError) {
      return reply.status(e?.statusCode).send({ message: e?.message });
    }
    return reply.status(STATUS_CODE.INTERNAL_SERVER_ERROR).send();
  }
}
