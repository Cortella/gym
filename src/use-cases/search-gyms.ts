import { GymsRepository } from "../repositories/gyms-repository";
import { prisma } from "../lib/prisma";
import { hash } from "bcryptjs";
import { Gym } from "@prisma/client";
import { ApiError } from "../errors/ApiError";
import { STATUS_CODE } from "../utils/status-code";
interface SearchGymsUseCaseRequest {
  query: string;
  page: number;
}

interface SearchGymsUseCaseResponse {
  gyms: Gym[];
}
export class SearchGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    query,
    page,
  }: SearchGymsUseCaseRequest): Promise<SearchGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.searchMany(query, page);

    return { gyms };
  }
}
