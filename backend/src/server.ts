import dotenv from "dotenv";
dotenv.config(); // ✅ correct for local + Render

import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";

import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
