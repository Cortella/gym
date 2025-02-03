import { z } from "zod";
import fastify from "fastify";
import { env } from "./env"
import { appRoutes } from "./http/routes";
import fastifyJwt from "@fastify/jwt";
import { STATUS_CODE } from "./utils/status-code";


export const app = fastify();

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})
app.register(appRoutes)

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





