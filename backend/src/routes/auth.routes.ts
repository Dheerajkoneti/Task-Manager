import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import User from "../models/User";

const router = Router();

/* =========================
   REGISTER
========================= */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const emailLower = email.toLowerCase();

    const existing = await User.findOne({ email: emailLower });
    if (existing) {
      return res.status(409).json({ message: "User already exists" });
    }
    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: emailLower,
      password: hashed,
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
/* =========================
   LOGIN
========================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const emailLower = email.toLowerCase();

    const user = await User.findOne({ email: emailLower });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      }
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   FORGOT PASSWORD
========================= */
/* =========================
   FORGOT PASSWORD
========================= */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const emailLower = email.toLowerCase();

    console.log("🔥 FORGOT PASSWORD:", emailLower);

    // 🔍 Find user (case-safe)
    const user = await User.findOne({ email: emailLower });

    // 🛡️ Security-safe response
    if (!user) {
      return res.json({ message: "If email exists, reset link sent" });
    }

    // 🔐 Create reset token
    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );

    // 🌍 Use frontend URL from ENV
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    console.log("🔗 RESET LINK:", resetLink);

    // 📧 Gmail transporter (Render-safe)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      secure: true,
    });

    // ✉️ Send email
    await transporter.sendMail({
      from: `"Task Manager" <${process.env.EMAIL_USER}>`,
      to: emailLower,
      subject: "Reset your password",
      html: `
        <h3>Password Reset</h3>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link expires in 15 minutes.</p>
      `,
    });

    console.log("✅ RESET EMAIL SENT");

    res.json({ message: "Reset link sent to email" });

  } catch (error) {
    console.error("❌ EMAIL ERROR:", error);
    res.status(500).json({ message: "Failed to send reset email" });
  }
});


/* =========================
   RESET PASSWORD
========================= */
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    // 🔐 Verify token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    // 🔒 Hash new password
    const hashed = await bcrypt.hash(password, 10);

    // 💾 Update password
    await User.findByIdAndUpdate(decoded.id, {
      password: hashed,
    });

    res.json({ message: "Password reset successful" });

  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
});

export default router;
