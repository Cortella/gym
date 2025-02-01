import { describe, expect, test, it, beforeEach } from "vitest";
import { compare, hash } from "bcryptjs";
import { InMemoryUsersRepository } from "../repositories/in-memory/in-memory-users-repository";
import { ApiError } from "../errors/ApiError";
import { AuthenticateUseCase } from "./authenticate";
import { InMemoryCheckInsRepository } from "../repositories/in-memory/in-memory-check-ins-repository";
import { CheckInUseCase } from "./check-in";

let checkInsRepository: InMemoryCheckInsRepository;
let sut: CheckInUseCase;

describe("CheckIn Use Case", () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new CheckInUseCase(checkInsRepository);
  });

  it("should be able to check-in", async () => {
    const { checkIn } = await sut.execute({
      userId: "user-id",
      gymId: "gym-id"
    });

    expect(checkIn?.id).toEqual(expect.any(String));
  });
});
