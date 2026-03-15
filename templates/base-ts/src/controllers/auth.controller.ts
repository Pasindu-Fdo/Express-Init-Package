import type { Response } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware.js";
import authService from "../services/auth.service.js";
import { asyncHandler } from "../middlewares/error.middleware.js";

class AuthController {
  register = asyncHandler(async (req, res: Response) => {
    const { name, email, password, role } = req.body;

    const token = await authService.register(name, email, password, role);

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
    // Implementation for forget password
    res.status(200).json({ message: "Forget password functionality not implemented yet." });
  });

  changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user!.id;

    await authService.changePassword(oldPassword, newPassword, confirmPassword, userId);

    res.status(200).json({
      message: "Password Changed Successfully",
    });
  });
}

export default new AuthController();
