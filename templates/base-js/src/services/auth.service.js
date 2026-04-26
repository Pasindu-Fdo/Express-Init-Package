import bcrypt from "bcryptjs";
import { createHash, randomBytes } from "crypto";
import jwt from "jsonwebtoken";
import userRepository from "../repositories/user.repository.js";
import {
  ConflictError,
  UnauthorizedError,
  NotFoundError,
  InternalServerError,
} from "../utils/errors.js";
import {
  validateLoginInput,
  validateChangePasswordInput,
  validateForgotPasswordInput,
  validateResetPasswordInput,
} from "../utils/validation.js";

class AuthService {
  async register(name, email, password) {
    const existing = await userRepository.findByEmail(email);
    if (existing) throw new ConflictError("Email already taken");

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await userRepository.create({ name, email, passwordHash });
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

  async forgotPassword(email) {
    const validatedInput = validateForgotPasswordInput({ email });

    const user = await userRepository.findByEmail(validatedInput.email);
    if (!user || !user.isActive) return { resetToken: null };

    const resetToken = randomBytes(32).toString("hex");
    const resetPasswordToken = createHash("sha256").update(resetToken).digest("hex");
    const resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);

    const updatedUser = await userRepository.update(user.id, {
      resetPasswordToken,
      resetPasswordExpires,
    });
    if (!updatedUser) throw new InternalServerError("Failed to create password reset token");

    return { resetToken };
  }

  async resetPassword(token, newPassword, confirmPassword) {
    const validatedInput = validateResetPasswordInput({ token, newPassword, confirmPassword });

    const resetPasswordToken = createHash("sha256").update(validatedInput.token).digest("hex");
    const user = await userRepository.findByResetPasswordToken(resetPasswordToken);
    if (!user) throw new UnauthorizedError("Invalid or expired reset token");

    const passwordHash = await bcrypt.hash(validatedInput.newPassword, 10);
    const updatedUser = await userRepository.update(user.id, {
      passwordHash,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });
    if (!updatedUser) throw new InternalServerError("Failed to reset password");
  }

  generateToken(id, role) {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
  }
}

export default new AuthService();
