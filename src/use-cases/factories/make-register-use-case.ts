import { RegisterUseCase } from "../registerUseCase";
import { PrismaUsersRepository } from "../../repositories/prisma/prisma-users-repository";

export function makeRegisterUseCase() {
  const prismaUsersRepository = new PrismaUsersRepository();
  const registerUseCase = new RegisterUseCase(prismaUsersRepository);

  return registerUseCase
}