import type { Response } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware.js";
import authService from "../services/auth.service.js";
import { asyncHandler } from "../middlewares/error.middleware.js";
import {
  validateRegisterInput,
  validateForgotPasswordInput,
  validateResetPasswordInput,
  validateChangePasswordInput,
} from "../utils/validation.js";

class AuthController {
  register = asyncHandler(async (req, res: Response) => {
    const { name, email, password } = validateRegisterInput(req.body);

    const token = await authService.register(name, email, password);

    res.status(201).json({
      message: "Registration successful",
      token,
    });
  });

  login = asyncHandler(async (req, res: Response) => {
    const { email, password } = req.body;

    const token = await authService.login(email, password);

    res.status(200).json({
      message: "Login successful",
      token,
    });
  });

  getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await authService.getProfile(req.user!.id);

    res.status(200).json(user);
  });

  forgetPassword = asyncHandler(async (req, res: Response) => {
    const { email } = validateForgotPasswordInput(req.body);
    const { resetToken } = await authService.forgotPassword(email);

    res.status(200).json({
      message: "Password reset token generated successfully",
      resetToken,
    });
  });

  resetPassword = asyncHandler(async (req, res: Response) => {
    const { token, newPassword, confirmPassword } = validateResetPasswordInput(req.body);

    await authService.resetPassword(token, newPassword, confirmPassword);

    res.status(200).json({ message: "Password reset successfully" });
  });

  changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { oldPassword, newPassword, confirmPassword } = validateChangePasswordInput(req.body);
    const userId = req.user!.id;

    await authService.changePassword(oldPassword, newPassword, confirmPassword, userId);

    res.status(200).json({
      message: "Password Changed Successfully",
    });
  });
}

export default new AuthController();
