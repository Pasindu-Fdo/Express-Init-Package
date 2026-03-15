import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userRepository from "../repositories/user.repository.js";
import {
  ConflictError,
  UnauthorizedError,
  NotFoundError,
  InternalServerError,
} from "../utils/errors.js";
import { validateLoginInput, validateChangePasswordInput } from "../utils/validation.js";

class AuthService {
  async register(name, email, password, role) {
    const existing = await userRepository.findByEmail(email);
    if (existing) throw new ConflictError("Email already taken");

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await userRepository.create({ name, email, role, passwordHash });
    if (!user) throw new InternalServerError("Failed to create user");

    return this.generateToken(user.id, user.role);
  }

  async login(email, password) {
    const validatedInput = validateLoginInput({ email, password });

    const user = await userRepository.findByEmail(validatedInput.email);
    if (!user) throw new UnauthorizedError("Invalid email or password");
    if (!user.isActive) throw new UnauthorizedError("Account is inactive");

    const isMatch = await bcrypt.compare(validatedInput.password, user.passwordHash);
    if (!isMatch) throw new UnauthorizedError("Invalid email or password.");

    return this.generateToken(user.id, user.role);
  }

  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) throw new NotFoundError("User not found");
    return user;
  }

  async changePassword(oldPassword, newPassword, confirmPassword, userId) {
    const validatedInput = validateChangePasswordInput({ oldPassword, newPassword, confirmPassword });

    const user = await userRepository.findById(userId);
    if (!user) throw new UnauthorizedError("Unauthorized");

    const isMatch = await bcrypt.compare(validatedInput.oldPassword, user.passwordHash);
    if (!isMatch) throw new UnauthorizedError("Incorrect Password");

    const passwordHash = await bcrypt.hash(validatedInput.newPassword, 10);
    const updatedUser = await userRepository.update(userId, { passwordHash });
    if (!updatedUser) throw new InternalServerError("Failed to update password");
  }

  generateToken(id, role) {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
  }
}

export default new AuthService();
