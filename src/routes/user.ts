import { Router, Response } from "express";
import pool from "../config/db";
import { verifyToken } from "../middleware/authMiddleware";
import { AuthRequest } from "../types/auth";

const router = Router();

// ======================= GET USER PROFILE =======================
router.get(
  "/dashboard-user",
  verifyToken,
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.user as { id: number };

      const result = await pool.query(
        "SELECT id, username, email, role, status FROM users WHERE id = $1",
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ user: result.rows[0] });
    } catch (err) {
      console.error("Dashboard user error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
