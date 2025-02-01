import { STATUS_CODE } from "../utils/status-code";
import { ApiError } from "../errors/ApiError";
import { CheckInsRepository } from "../repositories/check-ins-repository";
import { CheckIn } from "@prisma/client";

interface ValidateCheckInUseCaseRequest {
  checkInId: string
}

type ValidateCheckInUseCaseResponse = {
  checkIn: CheckIn;
};

export class ValidateCheckInUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository
  ) {}

  async execute({
    checkInId,
  }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId);

    if (!checkIn) throw new ApiError("Gym not found!", STATUS_CODE.NOT_FOUND);

    checkIn.validated_at = new Date();

    await this.checkInsRepository.save(checkIn);

    return { checkIn };
  }
}
