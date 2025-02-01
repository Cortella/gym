import { STATUS_CODE } from "../utils/status-code";
import { ApiError } from "../errors/ApiError";
import { CheckInsRepository } from "../repositories/check-ins-repository";
import { compare } from "bcryptjs";
import { CheckIn } from "@prisma/client";

interface CheckInUseCaseRequest {
  userId:string
  gymId: string
}

type CheckInUseCaseResponse = {
  checkIn: CheckIn
}

export class CheckInUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId, gymId  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const checkIn = await this.checkInsRepository.create({
      user_id: userId,
      gym_id: gymId
    }) 

    return { checkIn }
  }
}
