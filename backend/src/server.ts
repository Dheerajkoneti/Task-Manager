import dotenv from "dotenv";

/* 🔥 LOAD ENV FIRST */
dotenv.config();

import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";

import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";

connectDB();

const app = express();

/* 🌐 Middleware */
app.use(cors());
app.use(express.json());

/* ✅ Health check (ROOT ROUTE) */
app.get("/", (_req, res) => {
  res.send("🚀 Task Manager API is running");
});

/* 🔐 Routes */
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

/* 🚀 Start server */
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
