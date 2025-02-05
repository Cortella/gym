import { Prisma, User } from "@prisma/client";
import { UsersRepository } from "../users-repository";
import { randomUUID } from "node:crypto";

export class InMemoryUsersRepository implements UsersRepository {

  public items: User[] = [];
  async create(
    data: Prisma.UserCreateInput
  ): Promise<{
    name: string;
    id: string;
    email: string;
    password_hash: string;
    created_at: Date;
  }> {
   const user: User = {
     id: randomUUID(),
    name: data?.name,
    email: data?.email,
    password_hash: data?.password_hash,
    created_at: new Date(),
   } 

   this.items.push(user);

   return user
  }
  async findUserByEmail(
    email: string
  ): Promise<User | null> {
   const user = this.items.find((item) => item.email === email);

   if(!user) return null;

   return user
  }

  async findUserById(
    userId: string
  ): Promise<User | null> {
   const user = this.items.find((item) => item.id === userId);

   if(!user) return null;

   return user
  }
}
