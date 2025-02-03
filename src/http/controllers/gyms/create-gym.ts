import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { ApiError } from "../../../errors/ApiError";
import { STATUS_CODE } from "../../../utils/status-code";
import { makeCreateGymUseCase } from "../../../use-cases/factories/make-create-gym-use-case";

export async function CreateGymController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const createGymBodySchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.number().refine(value => Math.abs(value) <= 90),
    longitude: z.number().refine(value => Math.abs(value) <= 180),
  });

  const { title, description, phone, latitude, longitude } =
    createGymBodySchema.parse(request.body);
  try {
    const createGymUseCase = makeCreateGymUseCase();

    await createGymUseCase.execute({
      title,
      description,
      phone,
      latitude,
      longitude,
    });
  } catch (e) {
    if (e instanceof ApiError) {
      return reply.status(e?.statusCode).send({ message: e?.message });
    }
    return reply.status(STATUS_CODE.INTERNAL_SERVER_ERROR).send();
  }
  return reply.status(STATUS_CODE.OK).send();
}
