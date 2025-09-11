import { Router, Response } from "express";
import pool from "../config/db";
import { verifyToken, checkRoles } from "../middleware/authMiddleware";
import { AuthRequest } from "../types/auth";

const router = Router();

// ======================= GET ALL USERS =======================
router.get(
  "/dashboard-admin",
  verifyToken,
  checkRoles(["admin"]), // hanya admin boleh akses
  async (req: AuthRequest, res: Response) => {
    try {
      const result = await pool.query(
        "SELECT id, username, email, role, status FROM users ORDER BY id ASC"
      );
      res.json({ users: result.rows });
    } catch (err) {
      console.error("Dashboard admin error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
