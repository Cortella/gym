import { Prisma, Gym } from "@prisma/client";

export interface GymsRepository {
  findById(GymId: string): Promise<Gym | null>
}