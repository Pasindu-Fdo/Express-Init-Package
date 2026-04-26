import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authRateLimiter } from "../middlewares/rateLimit.middleware.js";

const router = Router();

// POST /auth/login
router.post("/login", authController.login);

// POST /auth/register
router.post("/register", authController.register);

// POST /auth/forgot-password
router.post("/forgot-password", authRateLimiter, authController.forgetPassword);

// POST /auth/reset-password
router.post("/reset-password", authRateLimiter, authController.resetPassword);

// GET /auth/me
router.get("/me", authMiddleware, authController.getProfile);

// POST /auth/change-password
router.post("/change-password", authMiddleware, authRateLimiter, authController.changePassword);

export default router;
