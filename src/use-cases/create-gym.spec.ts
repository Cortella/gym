import { describe, expect, test, it } from "vitest";
import { CreateGymUseCase } from "./create-gym";
import { InMemoryGymsRepository } from "../repositories/in-memory/in-memory-gyms-repository";
import { beforeEach } from "vitest";

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe("Create Gym Use Case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymsRepository);
  });
  it("should be able to create gym", async () => {
    const { gym } = await sut.execute({
      title: "Academia",
      description: null,
      phone: null,
      latitude: -27.2092052,
      longitude: -49.6401091
    });

    expect(gym?.id).toEqual(expect.any(String));
  });

});
