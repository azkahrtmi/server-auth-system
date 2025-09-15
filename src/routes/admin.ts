import { Router } from "express";
import { adminController } from "../controllers/adminController";
import { verifyToken, checkRoles } from "../middleware/authMiddleware";

const router = Router();

// Middleware khusus untuk semua route di sini
router.use(verifyToken, checkRoles(["admin"]));

router.get("/dashboard-admin", adminController.getAllUsers);
router.get("/dashboard-admin/:id", adminController.getUserById);
router.post("/dashboard-admin/create-admin", adminController.createAdmin);
router.post("/dashboard-admin/create-user", adminController.createUser);
router.patch("/dashboard-admin/:id", adminController.updateUser);
router.delete("/dashboard-admin/:id", adminController.deleteUser);

export default router;
