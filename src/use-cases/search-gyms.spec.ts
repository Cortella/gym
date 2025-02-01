import { describe, expect, test, it, beforeEach, afterEach, vi } from "vitest";
import { InMemoryGymsRepository } from "../repositories/in-memory/in-memory-gyms-repository";
import { SearchGymsUseCase } from "./search-gyms";

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;

describe("Search Gyms Use Case", () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsUseCase(gymsRepository);
  })

  it("should be able to search for gyms", async () => {

    await gymsRepository.create({
      title: "JS gym",
      description: null,
      phone: null,
      latitude: -27.2092052,
      longitude: -49.6401091
    })

    await gymsRepository.create({
      title: "TS gym",
      description: null,
      phone: null,
      latitude: -27.2092052,
      longitude: -49.6401091
    })

    const { gyms } = await sut.execute({
     query: "JS",
     page: 1
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual(expect.arrayContaining([
      expect.objectContaining({ title: "JS gym" }),
    ]))
  });

  it("should be able to fetch paginated gym search", async () => {

    for(let i = 1; i<= 22; i++) {
      await gymsRepository.create({
        title: `JS gym ${i}`,
        description: null,
        phone: null,
        latitude: -27.2092052,
        longitude: -49.6401091
      })
    }

    const { gyms } = await sut.execute({
      query: "JS",
      page: 2
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual(expect.arrayContaining([
      expect.objectContaining({ title: "JS gym 21" }),
      expect.objectContaining({ title: "JS gym 22" }),
    ]))
  });
});
