import dotenv from "dotenv";
import { Router } from "express";
import authController from "../controllers/authController";

dotenv.config();

const router = Router();

// ======================= REGISTER =======================
router.post("/signup", authController.register);

// ======================= LOGIN =======================
router.post("/signin", authController.login);

// ======================= PROFILE =======================
router.get("/profile", authController.getProfile);

// ======================= LOGOUT =======================
router.post("/signout", authController.logout);

export default router;
