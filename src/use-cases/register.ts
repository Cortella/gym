import { UsersRepository } from "../repositories/users-repository";
import { prisma } from "../lib/prisma";
import { hash } from "bcryptjs";
import { User } from "@prisma/client";
import { ApiError } from "../errors/ApiError";
import { STATUS_CODE } from "../utils/status-code";
interface RegisterUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

interface RegisterUseCaseResponse {
  user: User;
}
export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    name,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const password_hash = await hash(password, 6);

    const userAlreadyExists = await this.usersRepository.findUserByEmail(email);

    console.log("userAlreadyExists", userAlreadyExists);
    if (!!userAlreadyExists) throw new ApiError("User already exists!", STATUS_CODE.CONFLICT);

    const user = await this.usersRepository.create({
      email,
      name,
      password_hash,
    });

    return { user };
  }
}
