import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import { errorHandler } from "./middleware/errorHandler.js";
import messageRoutes from "./routes/messageRoutes.js";
import portfolioRoutes from "./routes/portfolioRoutes.js";

const app = express();

const allowedOrigins = new Set(
  [
    "http://localhost:5173",
    "http://localhost:8888",
    process.env.CLIENT_URL,
    process.env.URL,
    process.env.DEPLOY_PRIME_URL,
    process.env.DEPLOY_URL
  ]
    .filter(Boolean)
    .flatMap((value) => value.split(","))
    .map((item) => item.trim())
    .filter(Boolean)
);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin is not allowed by CORS."));
    }
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get(["/api/health", "/health"], (req, res) => {
  res.status(200).json({
    status: "ok",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

app.use(["/api/portfolio", "/portfolio"], portfolioRoutes);
app.use(["/api/messages", "/messages"], messageRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found."
  });
});

app.use(errorHandler);

export default app;
