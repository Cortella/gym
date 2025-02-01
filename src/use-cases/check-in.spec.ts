import { describe, expect, test, it, beforeEach, afterEach, vi } from "vitest";
import { ApiError } from "../errors/ApiError";
import { InMemoryCheckInsRepository } from "../repositories/in-memory/in-memory-check-ins-repository";
import { CheckInUseCase } from "./check-in";
import { InMemoryGymsRepository } from "../repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe("CheckIn Use Case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    gymsRepository.items.push();
    await gymsRepository.create({
      id: "gym-id",
      title: "Gym 01",
      description: "",
      phone: "",
      latitude: -27.2092052,
      longitude: -49.6401091,
    });
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check-in", async () => {
    const { checkIn } = await sut.execute({
      userId: "user-id",
      gymId: "gym-id",
      userLat: -27.2092052,
      userLong: -49.6401091,
    });

    expect(checkIn?.id).toEqual(expect.any(String));
  });

  it("should be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));
    await sut.execute({
      userId: "user-id",
      gymId: "gym-id",
      userLat: -27.2092052,
      userLong: -49.6401091,
    });

    await expect(() =>
      sut.execute({
        userId: "user-id",
        gymId: "gym-id",
        userLat: 0,
        userLong: 0,
      })
    ).rejects.toBeInstanceOf(ApiError);
  });

  it("should be able to check in twice but in different days", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));
    await sut.execute({
      userId: "user-id",
      gymId: "gym-id",
      userLat: -27.2092052,
      userLong: -49.6401091,
    });

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

    const { checkIn } = await sut.execute({
      userId: "user-id",
      gymId: "gym-id",
      userLat: -27.2092052,
      userLong: -49.6401091,
    });
    expect(checkIn?.id).toEqual(expect.any(String));
  });

  it("should not be able to check in on distant gym", async () => {
    gymsRepository.items.push({
      id: "gym-id-2",
      title: "Gym 02",
      description: "",
      phone: "",
      latitude: new Decimal(-27.0747279),
      longitude: new Decimal(-49.4889672),
    });
  
    await expect(() =>
      sut.execute({
        userId: "user-id",
        gymId: "gym-id-2",
        userLat: -27.2092052,
        userLong: -49.6401091,
      })
    ).rejects.toBeInstanceOf(ApiError);
  });
});


