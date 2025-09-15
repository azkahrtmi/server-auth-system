import { Request, Response } from "express";
import { AuthRequest } from "../types/auth";
import { adminService } from "../services/adminService";

export const adminController = {
  getAllUsers: async (req: AuthRequest, res: Response) => {
    try {
      const users = await adminService.getAllUsers();
      res.json({ users });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  },

  getUserById: async (req: AuthRequest, res: Response) => {
    try {
      const user = await adminService.getUserById(req.params.id);
      res.json({ user });
    } catch (err: any) {
      res.status(404).json({ message: err.message });
    }
  },

  createAdmin: async (req: Request, res: Response) => {
    try {
      const { username, email, password } = req.body;
      const user = await adminService.createUser(
        username,
        email,
        password,
        "admin"
      );
      res.status(201).json({ message: "Admin created successfully", user });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },

  createUser: async (req: Request, res: Response) => {
    try {
      const { username, email, password } = req.body;
      const user = await adminService.createUser(
        username,
        email,
        password,
        "user"
      );
      res.status(201).json({ message: "User created successfully", user });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },

  updateUser: async (req: Request, res: Response) => {
    try {
      const updatedUser = await adminService.updateUser(
        req.params.id,
        req.body
      );
      res.json({ message: "User updated successfully", user: updatedUser });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },

  deleteUser: async (req: AuthRequest, res: Response) => {
    try {
      const deletedUser = await adminService.deleteUser(
        req.params.id,
        req.user!.id
      );
      res.json({ message: "User deleted successfully", user: deletedUser });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },
};
