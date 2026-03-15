import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors.js";

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  message?: string;
}

/**
 * In-memory store for rate limiting
 * Key format: `${identifier}:${endpoint}`
 */
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Clean up expired entries periodically
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Clean up every minute

/**
 * Creates a rate limiting middleware
 * @param config - Rate limit configuration
 * @returns Express middleware function
 */
export function createRateLimiter(config: RateLimitConfig) {
  const { windowMs, maxRequests, message = `Too many requests, please try again later` } = config;

  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Use IP address as identifier (in production, consider using user ID for authenticated routes)
      const identifier = req.ip || req.socket.remoteAddress || "unknown";
      const endpoint = req.path;
      const key = `${identifier}:${endpoint}`;

      const now = Date.now();
      const entry = rateLimitStore.get(key);

      if (!entry || entry.resetTime < now) {
        // Create new entry or reset expired entry
        rateLimitStore.set(key, {
          count: 1,
          resetTime: now + windowMs,
        });
        next();
      } else if (entry.count < maxRequests) {
        // Increment counter
        entry.count++;
        next();
      } else {
        // Rate limit exceeded
        const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
        res.setHeader("Retry-After", retryAfter);
        res.setHeader("X-RateLimit-Limit", maxRequests);
        res.setHeader("X-RateLimit-Remaining", 0);
        res.setHeader("X-RateLimit-Reset", new Date(entry.resetTime).toISOString());

        throw new AppError(message, 429);
      }
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Rate limiter for authentication endpoints
 * More restrictive to prevent brute force attacks
 */
export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 requests per window
  message: "Too many authentication attempts, please try again after 15 minutes",
});

/**
 * Rate limiter for general API endpoints
 */
export const apiRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // 100 requests per window
  message: "Too many requests, please try again later",
});
