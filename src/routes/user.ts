import { Router, Response } from "express";
import pool from "../config/db";
import bcrypt from "bcrypt";
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

// ======================= UPDATE USER PROFILE =======================
router.patch(
  "/dashboard-user/:id",
  verifyToken,
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const userIdFromToken = (req.user as { id: number }).id;

      // pastikan user hanya bisa edit profil dirinya sendiri
      if (parseInt(id) !== userIdFromToken) {
        return res
          .status(403)
          .json({ message: "Forbidden: Cannot edit other user" });
      }

      const { username, email, password } = req.body;
      let query = "UPDATE users SET";
      const values: any[] = [];
      let setClauses: string[] = [];
      let index = 1;

      if (username) {
        setClauses.push(` username = $${index++}`);
        values.push(username);
      }
      if (email) {
        setClauses.push(` email = $${index++}`);
        values.push(email);
      }
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        setClauses.push(` password = $${index++}`);
        values.push(hashedPassword);
      }

      if (setClauses.length === 0) {
        return res.status(400).json({ message: "No fields to update" });
      }

      query += setClauses.join(",");
      query += ` WHERE id = $${index} RETURNING id, username, email, role, status`;
      values.push(userIdFromToken);

      const result = await pool.query(query, values);

      res.json({
        message: "Profile updated successfully",
        user: result.rows[0],
      });
    } catch (err) {
      console.error("Update user error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
