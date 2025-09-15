import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware";
import {
  dashboardUser,
  updateUserController,
} from "../controllers/userController";

const router = Router();

// ======================= GET USER PROFILE =======================
router.get("/dashboard-user", verifyToken, dashboardUser);

// ======================= UPDATE USER PROFILE =======================
router.patch("/dashboard-user/:id", verifyToken, updateUserController);

export default router;
