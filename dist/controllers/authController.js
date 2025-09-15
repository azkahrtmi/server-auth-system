"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authService_1 = __importDefault(require("../services/authService"));
async function register(req, res) {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await authService_1.default.register(username, email, password);
        res.status(201).json({
            message: "User registered successfully",
            user,
        });
    }
    catch (err) {
        console.error("Register error:", err);
        res.status(500).json({ message: "Server error" });
    }
}
async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }
        const { token, user } = await authService_1.default.login(email, password);
        // set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.json({ message: "Login successful", user });
    }
    catch (err) {
        console.error("Login error:", err);
        if (err.message === "Invalid credentials") {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: "Server error" });
    }
}
async function getProfile(req, res) {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "No token" });
        }
        const user = await authService_1.default.getProfile(token);
        res.json(user);
    }
    catch (err) {
        console.error("Profile error:", err);
        if (err.message === "User not found") {
            return res.status(404).json({ message: err.message });
        }
        return res.status(401).json({ message: "Invalid token" });
    }
}
async function logout(req, res) {
    res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    });
    res.json({ message: "Logged out successfully" });
}
exports.default = { register, login, getProfile, logout };
