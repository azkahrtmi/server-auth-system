import { Response } from "express";
import { getUserDashboard } from "../services/userService";
import { AuthRequest } from "../types/auth";

export async function dashboardUser(req: AuthRequest, res: Response) {
  try {
    const { id } = req.user as { id: number };
    const user = await getUserDashboard(id);
    res.json({ user });
  } catch (err: any) {
    if (err.message === "User not found") {
      return res.status(404).json({ message: err.message });
    }
    console.error("Dashboard user error:", err);
    res.status(500).json({ message: "Server error" });
  }
}
