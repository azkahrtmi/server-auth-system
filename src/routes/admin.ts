import { Router, Response } from "express";
import bcrypt from "bcrypt";
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

// ======================= ADMIN EDIT USER =======================
router.patch(
  "/dashboard-admin/:id",
  verifyToken,
  checkRoles(["admin"]), // hanya admin
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { username, email, password, role, status } = req.body;

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
      if (role) {
        setClauses.push(` role = $${index++}`);
        values.push(role);
      }
      if (status) {
        setClauses.push(` status = $${index++}`);
        values.push(status);
      }

      if (setClauses.length === 0) {
        return res.status(400).json({ message: "No fields to update" });
      }

      query += setClauses.join(",");
      query += ` WHERE id = $${index} RETURNING id, username, email, role, status`;
      values.push(id);

      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        message: "User updated successfully",
        user: result.rows[0],
      });
    } catch (err) {
      console.error("Admin update error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
