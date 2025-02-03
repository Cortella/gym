import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { ApiError } from "../../../errors/ApiError";
import { STATUS_CODE } from "../../../utils/status-code";
import { makeValidateCheckInUseCase } from "../../../use-cases/factories/make-validate-check-in-use-case";

export async function ValidateController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const validateCheckInParamsSchema = z.object({
      checkInId: z.string().uuid(),
    });

    const { checkInId } = validateCheckInParamsSchema.parse(request.params);

    const validateUseCase = makeValidateCheckInUseCase();

    await validateUseCase.execute({
      checkInId,
    });

    return reply.status(STATUS_CODE.NO_CONTENT).send();
  } catch (e) {
    if (e instanceof ApiError) {
      return reply.status(e?.statusCode).send({ message: e?.message });
    }
    return reply.status(STATUS_CODE.INTERNAL_SERVER_ERROR).send();
  }
}
