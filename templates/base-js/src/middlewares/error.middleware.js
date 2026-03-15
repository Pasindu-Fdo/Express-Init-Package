import { AppError } from "../utils/errors.js";
import logger from "../utils/logger.js";

/**
 * Global error handling middleware.
 * Must be registered AFTER all routes in app.js
 */
export const errorHandler = (err, req, res, _next) => {
  let statusCode = 500;
  let message = "Internal Server Error";

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Mongoose validation errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation Error";
    err.errors = Object.values(err.errors ?? {}).map((e) => e?.message ?? "");
  }

  // Mongoose duplicate key errors
  if (err.code === 11000) {
    statusCode = 409;
    const field = err.keyPattern ? Object.keys(err.keyPattern)[0] : "field";
    message = `Duplicate value for field: ${field}`;
  }

  // Mongoose CastError
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${String(err.value)}`;
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  if (statusCode >= 500) {
    logger.error({ message: err.message, stack: err.stack, url: req.originalUrl, method: req.method, ip: req.ip, statusCode });
  } else {
    logger.warn({ message: err.message, url: req.originalUrl, method: req.method, statusCode });
  }

  const response = { message, statusCode };
  if (process.env.NODE_ENV === "development" && err.stack) {
    response.stack = err.stack;
  }
  if (err.errors) {
    response.errors = err.errors;
  }

  res.status(statusCode).json(response);
};

/**
 * Catch-all 404 handler. Place BEFORE errorHandler in app.js.
 */
export const notFoundHandler = (req, _res, next) => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};

/**
 * Wraps async route handlers to forward errors to the error middleware.
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
