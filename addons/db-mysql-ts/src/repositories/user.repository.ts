import { type Role } from "@prisma/client";
import prisma from "../config/db.js";
import type { CreateUserInput, UpdateUserInput } from "../types/auth.type.js";

class UserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async findByResetPasswordToken(token: string) {
    return prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          gt: new Date(),
        },
      },
    });
  }

  async create(data: CreateUserInput) {
    return prisma.user.create({ data });
  }

  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateUserInput) {
    return prisma.user.update({ where: { id }, data });
  }
}

export default new UserRepository();
