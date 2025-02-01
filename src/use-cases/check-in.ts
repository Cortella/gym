import { STATUS_CODE } from "../utils/status-code";
import { ApiError } from "../errors/ApiError";
import { CheckInsRepository } from "../repositories/check-ins-repository";
import { compare } from "bcryptjs";
import { CheckIn } from "@prisma/client";
import { GymsRepository } from "../repositories/gyms-repository";
import { getDistanceBetweenCoordinates } from "../utils/get-distance-between-coordinates";

interface CheckInUseCaseRequest {
  userId: string;
  gymId: string;
  userLat: number;
  userLong: number;
}

type CheckInUseCaseResponse = {
  checkIn: CheckIn;
};

export class CheckInUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository,
    private gymsRepository: GymsRepository
  ) {}

  async execute({
    userId,
    gymId,
    userLat,
    userLong,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId);

    if (!gym) throw new ApiError("Gym not found!", STATUS_CODE.NOT_FOUND);

    //calcular a distancia
    const distance = getDistanceBetweenCoordinates(
      {
        latitude: userLat,
        longitude: userLong,
      },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      }
    );

    const MAX_DISTANCE_IN_KM = 0.1;

    if (distance > MAX_DISTANCE_IN_KM) {
      throw new ApiError(
        "You are too far from the gym!",
        STATUS_CODE.BAD_REQUEST
      );
    }
    const checkInOnSameDate = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date()
    );

    if (checkInOnSameDate)
      throw new ApiError(
        "You already checked in on this day!",
        STATUS_CODE.CONFLICT
      );
    const checkIn = await this.checkInsRepository.create({
      user_id: userId,
      gym_id: gymId,
    });

    return { checkIn };
  }
}
