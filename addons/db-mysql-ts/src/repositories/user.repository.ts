import { type Role } from "@prisma/client";
import prisma from "../config/db.js";
import type { CreateUserInput, UpdateUserInput } from "../types/auth.type.js";

class UserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async create(data: CreateUserInput) {
    return prisma.user.create({
      data: { ...data, role: data.role as Role },
    });
  }

  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateUserInput) {
    return prisma.user.update({
      where: { id },
      data: { ...data, ...(data.role && { role: data.role as Role }) },
    });
  }
}

export default new UserRepository();
