import { Request, Response } from "express";
import adminService from "../services/adminService";
import { AuthRequest } from "../types/auth";

export const adminController = {
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await adminService.getAllUsers();
      res.json({ users });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  },

  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await adminService.getUserById(Number(id));
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json({ user });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  },

  async createAdmin(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;
      if (!username || !email || !password)
        return res.status(400).json({ message: "All fields are required" });

      const user = await adminService.createAdmin(username, email, password);
      res.status(201).json({ message: "Admin created successfully", user });
    } catch (err: any) {
      res.status(400).json({ message: err.message || "Server error" });
    }
  },

  async createUser(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;
      if (!username || !email || !password)
        return res.status(400).json({ message: "All fields are required" });

      const user = await adminService.createUser(username, email, password);
      res.status(201).json({ message: "User created successfully", user });
    } catch (err: any) {
      res.status(400).json({ message: err.message || "Server error" });
    }
  },

  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updated = await adminService.updateUser(Number(id), req.body);
      if (!updated) return res.status(404).json({ message: "User not found" });
      res.json({ message: "User updated successfully", user: updated });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  },

  async deleteUser(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await adminService.deleteUser(Number(id), req.user!.id);
      if (!deleted) return res.status(404).json({ message: "User not found" });
      res.json({ message: "User deleted successfully", user: deleted });
    } catch (err: any) {
      res.status(400).json({ message: err.message || "Server error" });
    }
  },
};
