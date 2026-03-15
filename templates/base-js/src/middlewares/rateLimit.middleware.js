import { AppError } from "../utils/errors.js";

const rateLimitStore = new Map();

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 60000);

export function createRateLimiter({ windowMs, maxRequests, message = "Too many requests, please try again later" }) {
  return (req, res, next) => {
    try {
      const identifier = req.ip || req.socket.remoteAddress || "unknown";
      const key = `${identifier}:${req.path}`;
      const now = Date.now();
      const entry = rateLimitStore.get(key);

      if (!entry || entry.resetTime < now) {
        rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
        next();
      } else if (entry.count < maxRequests) {
        entry.count++;
        next();
      } else {
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

export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 5,
  message: "Too many authentication attempts, please try again after 15 minutes",
});

export const apiRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 100,
  message: "Too many requests, please try again later",
});
