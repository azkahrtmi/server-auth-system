"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardUser = dashboardUser;
exports.updateUserController = updateUserController;
const userService_1 = require("../services/userService");
const userService_2 = require("../services/userService");
async function dashboardUser(req, res) {
    try {
        const { id } = req.user;
        const user = await (0, userService_1.getUserDashboard)(id);
        res.json({ user });
    }
    catch (err) {
        if (err.message === "User not found") {
            return res.status(404).json({ message: err.message });
        }
        console.error("Dashboard user error:", err);
        res.status(500).json({ message: "Server error" });
    }
}
async function updateUserController(req, res) {
    try {
        const { id } = req.params;
        const userIdFromToken = req.user.id;
        const { username, email } = req.body;
        const updatedUser = await (0, userService_2.updateUserProfile)(userIdFromToken, parseInt(id), {
            username,
            email,
        });
        res.json({
            message: "Profile updated successfully",
            user: updatedUser,
        });
    }
    catch (err) {
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
