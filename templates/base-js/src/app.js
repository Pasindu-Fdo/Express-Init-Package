import express from "express";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes/index.js";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware.js";
import { apiRateLimiter } from "./middlewares/rateLimit.middleware.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === "production") {
  app.use(helmet());
} else {
  app.use(helmet({ contentSecurityPolicy: false }));
}
app.use(apiRateLimiter);

// API routes
app.use("/api", routes);

// Health check route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
