import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { ApiError } from "../../../errors/ApiError";
import { STATUS_CODE } from "../../../utils/status-code";
import { makeFetchNearbyGymsUseCase } from "../../../use-cases/factories/make-fetch-nearby-gyms-use-case";

export async function fetchNearbyGymController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const nearbyGymsQuerySchema = z.object({
    latitude: z.number().refine(value => Math.abs(value) <= 90),
    longitude: z.number().refine(value => Math.abs(value) <= 180)
  });

  const { latitude, longitude } = nearbyGymsQuerySchema.parse(request.body);
  try {
    const fetchNearbyGymsUseCase = makeFetchNearbyGymsUseCase();

    const { gyms } = await fetchNearbyGymsUseCase.execute({
      userLatitude: latitude,
      userLongitude: longitude
    });

    return reply.status(STATUS_CODE.OK).send(gyms);
  } catch (e) {
    if (e instanceof ApiError) {
      return reply.status(e?.statusCode).send({ message: e?.message });
    }
    return reply.status(STATUS_CODE.INTERNAL_SERVER_ERROR).send();
  }
}
