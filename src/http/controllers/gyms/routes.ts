import { FastifyInstance } from "fastify";
import { verifyJWT } from "../../middlewares/verify-jwt";
import { searchGymController } from "./search-gyms";
import { fetchNearbyGymController} from './fetch-nearby-gyms'
import { CreateGymController } from "./create-gym"

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/gyms/search', searchGymController)
  app.get('/gyms/nearby', fetchNearbyGymController)

  app.post('/gyms', CreateGymController)
}