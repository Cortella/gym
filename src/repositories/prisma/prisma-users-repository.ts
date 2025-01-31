import { Prisma, User } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { UsersRepository } from "../users-repository";

export class PrismaUsersRepository implements UsersRepository {
  findUserById(
    userId: string
  ): Promise<{
    name: string;
    id: string;
    email: string;
    password_hash: string;
    created_at: Date;
  } | null> {
    throw new Error("Method not implemented.");
  }
  async findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    });
    return user;
  }
}
