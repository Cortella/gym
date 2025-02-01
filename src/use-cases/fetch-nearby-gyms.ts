import { GymsRepository } from "../repositories/gyms-repository";
import { prisma } from "../lib/prisma";
import { hash } from "bcryptjs";
import { Gym } from "@prisma/client";
import { ApiError } from "../errors/ApiError";
import { STATUS_CODE } from "../utils/status-code";
interface FetchNearbyGymsUseCaseRequest {
  userLatitude: number;
  userLongitude: number;
}

interface FetchNearbyGymsUseCaseResponse {
  gyms: Gym[];
}
export class FetchNearbyGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    userLatitude,
    userLongitude,
  }: FetchNearbyGymsUseCaseRequest): Promise<FetchNearbyGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude
    });

    return { gyms };
  }
}
