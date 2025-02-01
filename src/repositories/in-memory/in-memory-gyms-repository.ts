import { Decimal } from "@prisma/client/runtime/library";
import { GymsRepository } from "../gyms-repository";
import { Gym } from "@prisma/client";

export class InMemoryGymsRepository implements GymsRepository{
  public items: Gym[] = [];
  async findById(GymId: string): Promise<Gym | null> {
    const gym = this.items.find((item) => item.id === GymId);

    if(!gym) return null;
    return gym
  }
}