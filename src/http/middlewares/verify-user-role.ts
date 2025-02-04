import { STATUS_CODE } from "../../utils/status-code";
import { FastifyReply, FastifyRequest } from "fastify";

export function verifyUserRole(roleToVerify: "ADMIN" | "MEMBER") {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { role } = request.user;
  
    if (role !== roleToVerify) {
      return reply
        .status(STATUS_CODE.UNAUTHORIZED)
        .send({ message: "Unauthorized" });
    }
  }
}
