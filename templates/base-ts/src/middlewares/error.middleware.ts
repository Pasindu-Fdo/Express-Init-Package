import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors.js";
import logger from "../utils/logger.js";

interface ErrorResponse {
  message: string;
  statusCode: number;
  stack?: string | undefined;
  errors?: unknown;
}

/**
 * Global error handling middleware
 * Must be registered AFTER all routes in app.ts
 */
export const errorHandler = (err: unknown, req: Request, res: Response, _next: NextFunction) => {
  const error = err as Error & Record<string, unknown>;

  // Default error values
  let statusCode = 500;
  let message = "Internal Server Error";

  // Handle custom AppError instances
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Handle Mongoose validation errors
  if ((error as { name?: string }).name === "ValidationError") {
    statusCode = 400;
    message = "Validation Error";
    const errs = (error as { errors?: Record<string, { message?: string }> }).errors;
    const validationErrors = errs ? Object.values(errs).map((e) => e?.message ?? "") : [];
    (error as Record<string, unknown>).errors = validationErrors;
  }

  // Handle Mongoose duplicate key errors
  if ((error as { code?: number }).code === 11000) {
    statusCode = 409;
    const keyPattern = (error as { keyPattern?: Record<string, unknown> }).keyPattern;
    const field = keyPattern ? Object.keys(keyPattern)[0] : "field";
    message = `Duplicate value for field: ${field}`;
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if ((error as { name?: string }).name === "CastError") {
    statusCode = 400;
    const path = (error as { path?: string }).path;
    const value = (error as { value?: unknown }).value;
    message = `Invalid ${path}: ${String(value)}`;
  }

  // Handle JWT errors
  if ((error as { name?: string }).name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  if ((error as { name?: string }).name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  // Log errors
  if (statusCode >= 500) {
    logger.error({
      message: (error as Error).message,
      stack: (error as { stack?: string }).stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      statusCode,
    });
  } else {
    logger.warn({
      message: (error as Error).message,
      url: req.originalUrl,
      method: req.method,
      statusCode,
    });
  }

  // Build response
  const response: ErrorResponse = {
    message,
    statusCode,
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === "development" && (error as { stack?: string }).stack) {
    response.stack = (error as { stack?: string }).stack;
  }

  // Include validation errors if present
  if ((error as Record<string, unknown>).errors) {
    response.errors = (error as Record<string, unknown>).errors;
  }

  res.status(statusCode).json(response);
};

/**
 * Catch-all middleware for 404 Not Found
 * Place this BEFORE errorHandler in app.ts
 */
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};

/**
 * Async handler wrapper to catch errors in async route handlers
 * Usage: asyncHandler(async (req, res) => { ... })
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
