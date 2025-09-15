import { Request, Response } from "express";
import authService from "../services/authService";
import { log } from "console";

async function register(req: Request, res: Response) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await authService.register(username, email, password);

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const { token, user } = await authService.login(email, password);

    // set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // ganti true kalau sudah pakai https
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ message: "Login successful", user });
  } catch (err: any) {
    console.error("Login error:", err);
    if (err.message === "Invalid credentials") {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: "Server error" });
  }
}

export default { register, login };
