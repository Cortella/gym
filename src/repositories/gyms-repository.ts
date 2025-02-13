import { Prisma, Gym } from "@prisma/client";

export interface FindManyNearbyParams {
  latitude: number
  longitude: number
}
export interface GymsRepository {
  findById(GymId: string): Promise<Gym | null>
  create(data: Prisma.GymCreateInput): Promise<Gym>
  findManyNearby({latitude, longitude} : FindManyNearbyParams): Promise<Gym[]>
  searchMany(query: string, page: number): Promise<Gym[]>
}

