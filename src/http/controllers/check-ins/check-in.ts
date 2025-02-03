import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { ApiError } from "../../../errors/ApiError";
import { STATUS_CODE } from "../../../utils/status-code";
import { makeCheckInUseCase } from "../../../use-cases/factories/make-check-in-use-case";

export async function CheckInController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const createCheckInParamsSchema = z.object({
    gymId: z.string().uuid(),
  });
  const checkInBodySchema = z.object({
    latitude: z.coerce.number().refine((value) => Math.abs(value) <= 90),
    longitude: z.coerce.number().refine((value) => Math.abs(value) <= 180),
  });

  const { latitude, longitude } = checkInBodySchema.parse(request.body);

  const { gymId } = createCheckInParamsSchema.parse(request.params);
  try {
    const checkInUseCase = makeCheckInUseCase();

    await checkInUseCase.execute({
      gymId,
      userId: request.user.sub,
      userLat: latitude,
      userLong: longitude,
    });

    return reply.status(STATUS_CODE.CREATED).send();
  } catch (e) {
    if (e instanceof ApiError) {
      return reply.status(e?.statusCode).send({ message: e?.message });
    }
    return reply.status(STATUS_CODE.INTERNAL_SERVER_ERROR).send();
  }
}
