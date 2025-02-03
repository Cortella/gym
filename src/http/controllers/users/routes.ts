import { authenticate } from "./authenticate";
import { register } from "./register";
import { FastifyInstance } from "fastify";
import { getUserProfile } from "./get-user-profile";
import { verifyJWT } from "../../middlewares/verify-jwt";

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', register)
  
  app.post('/sessions', authenticate)
  
  //autheticated
  app.get('/me', {onRequest: [verifyJWT]},getUserProfile)
}