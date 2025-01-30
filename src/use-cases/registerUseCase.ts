import { UsersRepository } from "../repositories/users-repository";
import { prisma } from "../lib/prisma";
import { hash } from "bcryptjs";
interface RegisterUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ email, name, password }: RegisterUseCaseRequest) {
    const password_hash = await hash(password, 6);

    const userAlreadyExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userAlreadyExists) throw new Error("User already exists!");

    await this.usersRepository.create({ email, name, password_hash });
  }
}
