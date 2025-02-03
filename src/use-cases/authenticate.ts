import { STATUS_CODE } from "../utils/status-code";
import { ApiError } from "../errors/ApiError";
import { UsersRepository } from "../repositories/users-repository";
import { compare } from "bcryptjs";
import { User } from "@prisma/client";

interface AuthenticateUseCaseRequest {
  email: string;
  password: string;
}

type AuthenticateUseCaseResponse = {
  user: User
}

export class AuthenticateUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.usersRepository.findUserByEmail(email);

    if (!user) {
      throw new ApiError("Invalid Credentials", STATUS_CODE.BAD_REQUEST);
    }

    const doesPasswordMatches = await compare(password, user.password_hash);
    if (!doesPasswordMatches)
      throw new ApiError("Invalid Credentials", STATUS_CODE.BAD_REQUEST);
    
    return { user }
  }
}
