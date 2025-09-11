import { Router } from "express";
import { Request as ExpressRequest, Response } from "express";

import bcrypt from "bcrypt";
import pool from "../config/db";
import { verifyToken, checkRoles } from "../middleware/authMiddleware";
import { AuthRequest } from "../types/auth";

const router = Router();

interface CreateUserBody {
  username: string;
  email: string;
  password: string;
}

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

// ======================= CREATE ADMIN =======================
router.post(
  "/dashboard-admin/create-admin",
  verifyToken,
  checkRoles(["admin"]), // hanya admin boleh buat admin baru
  async (req: ExpressRequest<{}, {}, CreateUserBody>, res: Response) => {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const existing = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );
      if (existing.rows.length > 0) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await pool.query(
        `INSERT INTO users (username, email, password, role, status) 
         VALUES ($1, $2, $3, 'admin', 'active') 
         RETURNING id, username, email, role, status`,
        [username, email, hashedPassword]
      );

      res.status(201).json({
        message: "Admin created successfully",
        user: result.rows[0],
      });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// ======================= CREATE USER =======================
router.post(
  "/dashboard-admin/create-user",
  verifyToken,
  checkRoles(["admin"]), // hanya admin boleh buat user baru
  async (req: ExpressRequest<{}, {}, CreateUserBody>, res: Response) => {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const existing = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );
      if (existing.rows.length > 0) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await pool.query(
        `INSERT INTO users (username, email, password, role, status) 
         VALUES ($1, $2, $3, 'user', 'active') 
         RETURNING id, username, email, role, status`,
        [username, email, hashedPassword]
      );

      res.status(201).json({
        message: "User created successfully",
        user: result.rows[0],
      });
    } catch (err) {
      console.error("Create user error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
