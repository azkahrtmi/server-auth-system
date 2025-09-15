import { Response } from "express";
import { getUserDashboard } from "../services/userService";
import { AuthRequest } from "../types/auth";
import { updateUserProfile } from "../services/userService";

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

export async function updateUserController(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const userIdFromToken = (req.user as { id: number }).id;

    const { username, email } = req.body;

    const updatedUser = await updateUserProfile(userIdFromToken, parseInt(id), {
      username,
      email,
    });

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err: any) {
    if (err.message === "Forbidden: Cannot edit other user") {
      return res.status(403).json({ message: err.message });
    }
    if (err.message === "No fields to update") {
      return res.status(400).json({ message: err.message });
    }

    console.error("Update user error:", err);
    res.status(500).json({ message: "Server error" });
  }
}
