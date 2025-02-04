import { FastifyInstance } from "fastify";
import { verifyJWT } from "../../middlewares/verify-jwt";
import { CheckInController } from "./check-in";
import { ValidateController } from "./validate";
import { HistoryController } from "./history";
import { MetricsController } from "./metrics";
import { verifyUserRole } from "../../middlewares/verify-user-role";

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/check-ins/history', HistoryController)
  app.get('/check-ins/metrics', MetricsController)

  app.post('/gyms/:gymId/check-ins', CheckInController)
  app.patch('/check-ins/:checkInId/validate', {onRequest: [verifyUserRole('ADMIN')]},ValidateController)
}