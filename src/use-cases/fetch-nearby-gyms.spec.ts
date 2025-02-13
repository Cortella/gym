import { describe, expect, test, it, beforeEach, afterEach, vi } from "vitest";
import { InMemoryGymsRepository } from "../repositories/in-memory/in-memory-gyms-repository";
import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms";

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe("Fetch Nearby Gyms Use Case", () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsUseCase(gymsRepository);
  })

  it("should be able to search for gyms", async () => {

    await gymsRepository.create({
      title: "Near Gym",
      description: null,
      phone: null,
      latitude: -27.2092052,
      longitude: -49.6401091
    })

    await gymsRepository.create({
      title: "gym longe",
      description: null,
      phone: null,
      latitude: 27.2092052,
      longitude: 49.6401091
    })

    const { gyms } = await sut.execute({
     userLatitude: -27.202052,
     userLongitude: -49.6401091
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual(expect.arrayContaining([
      expect.objectContaining({ title: "Near Gym" }),
    ]))
  });
});
