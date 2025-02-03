import { authenticate } from "../http/controllers/authenticate";
import { register } from "./controllers/register";
import { FastifyInstance } from "fastify";
import { getUserProfile } from "../http/controllers/profile"
import { verifyJWT } from "../http/middlewares/verify-jwt";

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)
  
  app.post('/sessions', authenticate)
  
  //autheticated
  app.get('/me', {onRequest: [verifyJWT]},getUserProfile)
}