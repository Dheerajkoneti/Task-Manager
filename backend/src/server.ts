import dotenv from "dotenv";

/* 🔥 LOAD ENV FIRST (ABSOLUTELY FIRST LINE) */
dotenv.config({ path: ".env" });

import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";

import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";

/* 🔍 DEBUG (TEMPORARY) */
console.log("MONGO_URI:", process.env.MONGO_URI);
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS loaded:", !!process.env.EMAIL_PASS);

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.listen(5000, () =>
  console.log("🚀 Server running on port 5000")
);
