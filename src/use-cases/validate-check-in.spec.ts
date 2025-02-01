import { describe, expect, test, it, beforeEach, afterEach, vi } from "vitest";
import { ApiError } from "../errors/ApiError";
import { InMemoryCheckInsRepository } from "../repositories/in-memory/in-memory-check-ins-repository";
import { ValidateCheckInUseCase } from "./validate-check-in";

let checkInsRepository: InMemoryCheckInsRepository;
let sut: ValidateCheckInUseCase;

describe("CheckIn Use Case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new ValidateCheckInUseCase(checkInsRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to validate check-in", async () => {
    const checkIn = await checkInsRepository.create({
      user_id: "user-id",
      gym_id: "gym-id",
    });

    await sut.execute({
      checkInId: checkIn.id,
    });

    expect(checkIn?.validated_at).toEqual(expect.any(Date));
    expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date));
  });

  it("should not be able to validate an inexistent check-in", async () => {
    await expect(() =>
      sut.execute({ checkInId: "inexistent-check-in-id" })
    ).rejects.toBeInstanceOf(ApiError);
  });

  it("should not be able to validate the check-in after 20 minutes of its creation", async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40));

    const checkIn = await checkInsRepository.create({
      user_id: "user-id",
      gym_id: "gym-id",
    });

    const twentyOneMinutesInMs = 1000 * 60 * 21;

    vi.advanceTimersByTime(twentyOneMinutesInMs);

    await expect(() =>
      sut.execute({ checkInId: checkIn.id })).rejects.toBeInstanceOf(ApiError);
  });
});
