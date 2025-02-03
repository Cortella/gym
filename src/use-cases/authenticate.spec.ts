import { describe, expect, it, beforeEach } from "vitest";
import { compare, hash } from "bcryptjs";
import { InMemoryUsersRepository } from "../repositories/in-memory/in-memory-users-repository";
import { ApiError } from "../errors/ApiError";
import { AuthenticateUseCase } from "./authenticate";

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe("Authenticate Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepository);
  });

  it("should be able to authenticate", async () => {
    await usersRepository.create({
      email: "jE2wZ@example.com",
      name: "John Doe",
      password_hash: await hash("123456", 6),
    });
    const { user } = await sut.execute({
      email: "jE2wZ@example.com",
      password: "123456",
    });

    expect(user?.id).toEqual(expect.any(String));
  });

  it("should not be able to authenticate with wrong email", async () => {
    await expect(() =>
      sut.execute({
        email: "jE2wZ@example.com",
        password: "12345",
      })
    ).rejects.toBeInstanceOf(ApiError);
  });

  it("should not be able to authenticate with wrong password", async () => {
    await usersRepository.create({
      email: "jE2wZ@example.com",
      name: "John Doe",
      password_hash: await hash("123456", 6),
    });
  
    await expect(
      sut.execute({
        email: "jE2wZ@example.com",
        password: "wrongpassword", // Senha errada
      })
    ).rejects.toBeInstanceOf(ApiError);
  });
});
