"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminController = void 0;
const adminService_1 = __importDefault(require("../services/adminService"));
exports.adminController = {
    async getAllUsers(req, res) {
        try {
            const users = await adminService_1.default.getAllUsers();
            res.json({ users });
        }
        catch (err) {
            res.status(500).json({ message: "Server error" });
        }
    },
    async getUserById(req, res) {
        try {
            const { id } = req.params;
            const user = await adminService_1.default.getUserById(Number(id));
            if (!user)
                return res.status(404).json({ message: "User not found" });
            res.json({ user });
        }
        catch (err) {
            res.status(500).json({ message: "Server error" });
        }
    },
    async createAdmin(req, res) {
        try {
            const { username, email, password } = req.body;
            if (!username || !email || !password)
                return res.status(400).json({ message: "All fields are required" });
            const user = await adminService_1.default.createAdmin(username, email, password);
            res.status(201).json({ message: "Admin created successfully", user });
        }
        catch (err) {
            res.status(400).json({ message: err.message || "Server error" });
        }
    },
    async createUser(req, res) {
        try {
            const { username, email, password } = req.body;
            if (!username || !email || !password)
                return res.status(400).json({ message: "All fields are required" });
            const user = await adminService_1.default.createUser(username, email, password);
            res.status(201).json({ message: "User created successfully", user });
        }
        catch (err) {
            res.status(400).json({ message: err.message || "Server error" });
        }
    },
    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const updated = await adminService_1.default.updateUser(Number(id), req.body);
            if (!updated)
                return res.status(404).json({ message: "User not found" });
            res.json({ message: "User updated successfully", user: updated });
        }
        catch (err) {
            res.status(500).json({ message: "Server error" });
        }
    },
    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const deleted = await adminService_1.default.deleteUser(Number(id), req.user.id);
            if (!deleted)
                return res.status(404).json({ message: "User not found" });
            res.json({ message: "User deleted successfully", user: deleted });
        }
        catch (err) {
            res.status(400).json({ message: err.message || "Server error" });
        }
    },
};
