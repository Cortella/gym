import { z } from "zod";
import fastify from "fastify";
import fastifyCookie from "@fastify/cookie";
import { env } from "./env";
import { usersRoutes } from "./http/controllers/users/routes";
import fastifyJwt from "@fastify/jwt";
import { STATUS_CODE } from "./utils/status-code";
import { gymsRoutes } from "./http/controllers/gyms/routes";
import { checkInsRoutes } from "./http/controllers/check-ins/routes";

export const app = fastify();

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: "refreshToken",
    signed: false,
  },
  sign: {
    expiresIn: "10m",
  },
});

app.register(fastifyCookie);

app.register(usersRoutes);
app.register(gymsRoutes);
app.register(checkInsRoutes);

app.setErrorHandler((error, _, reply) => {
  if (error instanceof z.ZodError) {
    return reply
      .status(STATUS_CODE.BAD_REQUEST)
      .send({ message: "Validation error", issues: error.format() });
  }

  if (env.NODE_ENV !== "production") {
    console.error(error);
  } else {
    // TODO: Here we should log to a external tool like DataDog/NewRelic/Sentry
  }

  return reply.status(STATUS_CODE.INTERNAL_SERVER_ERROR).send({
    message: "Internal server error",
  });
});
