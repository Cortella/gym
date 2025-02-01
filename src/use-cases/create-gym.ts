import { GymsRepository } from "../repositories/gyms-repository";
import { prisma } from "../lib/prisma";
import { hash } from "bcryptjs";
import { Gym } from "@prisma/client";
import { ApiError } from "../errors/ApiError";
import { STATUS_CODE } from "../utils/status-code";
interface CreateGymUseCaseRequest {
  title: string;
  description: string | null;
  phone: string | null;
  latitude: number;
  longitude: number;
}

interface CreateGymUseCaseResponse {
  gym: Gym;
}
export class CreateGymUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    title,
    description,
    phone,
    latitude,
    longitude
  }: CreateGymUseCaseRequest): Promise<CreateGymUseCaseResponse> {

    const gym = await this.gymsRepository.create({
      title,
      description,
      phone,
      latitude,
      longitude
    });

    return { gym };
  }
}
