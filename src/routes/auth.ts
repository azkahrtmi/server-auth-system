import dotenv from "dotenv";
import { Router, Request, Response } from "express";

import pool from "../config/db";
import jwt from "jsonwebtoken";
import authController from "../controllers/authController";

dotenv.config();

const router = Router();

// ======================= REGISTER =======================
router.post("/signup", authController.register);

// ======================= LOGIN =======================
router.post("/signin", authController.login);

// ======================= PROFILE =======================
router.get("/profile", async (req: Request, res: Response) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "No token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      role: string;
    };

    // ambil data user dari database
    const userResult = await pool.query(
      "SELECT id, username, email, role, status FROM users WHERE id = $1",
      [decoded.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userResult.rows[0];
    res.json(user); // kirim user lengkap ke frontend
  } catch (err) {
    console.error("Profile error:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
});

// ======================= LOGOUT =======================
router.post("/signout", (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
  res.json({ message: "Logged out successfully" });
});

export default router;
