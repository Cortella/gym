import { STATUS_CODE } from "../utils/status-code";
import { ApiError } from "../errors/ApiError";
import { UsersRepository } from "../repositories/users-repository";
import { compare } from "bcryptjs";
import { User } from "@prisma/client";

interface GetUserProfileUseCaseRequest {
  userId: string;
}

type GetUserProfileUseCaseResponse = {
  user: User;
};

export class GetUserProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(
    {userId }: GetUserProfileUseCaseRequest
  ): Promise<GetUserProfileUseCaseResponse> {
    const user = await this.usersRepository.findUserById(userId);

    if (!user) {
      throw new ApiError("User not found", STATUS_CODE.NOT_FOUND);
    }
    
    return { user };
  }
}
