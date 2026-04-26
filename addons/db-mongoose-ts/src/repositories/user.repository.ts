import User from "../models/user.model.js";
import type { CreateUserInput, UpdateUserInput } from "../types/auth.type.js";

class UserRepository {
  async findByEmail(email: string) {
    return User.findOne({ email });
  }

  async findByResetPasswordToken(token: string) {
    return User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });
  }

  async create(data: CreateUserInput) {
    const user = await User.create(data);
    return Array.isArray(user) ? user[0] : user;
  }

  async findById(id: string) {
    return User.findById(id);
  }

  async update(id: string, data: UpdateUserInput) {
    return User.findByIdAndUpdate(id, data, { new: true });
  }
}

export default new UserRepository();
