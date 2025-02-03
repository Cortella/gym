import { STATUS_CODE } from "../../utils/status-code";
import { FastifyReply, FastifyRequest } from "fastify";

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch(err) {
    return reply.status(STATUS_CODE.UNAUTHORIZED).send({ message: 'Unauthorized' });
  }
}