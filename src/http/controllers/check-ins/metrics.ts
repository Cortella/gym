import { FastifyRequest, FastifyReply } from "fastify";
import { ApiError } from "../../../errors/ApiError";
import { STATUS_CODE } from "../../../utils/status-code";
import { makeGetUserMetricsUseCase } from "../../../use-cases/factories/make-get-user-metrics-use-case";

export async function MetricsController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const metricsUseCase = makeGetUserMetricsUseCase();

    const { checkInsCount } = await metricsUseCase.execute({
      userId: request.user.sub,
    });

    return reply.status(STATUS_CODE.OK).send(checkInsCount);
  } catch (e) {
    if (e instanceof ApiError) {
      return reply.status(e?.statusCode).send({ message: e?.message });
    }
    return reply.status(STATUS_CODE.INTERNAL_SERVER_ERROR).send();
  }
}
