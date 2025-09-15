"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Middleware khusus untuk semua route di sini
router.use(authMiddleware_1.verifyToken, (0, authMiddleware_1.checkRoles)(["admin"]));
router.get("/dashboard-admin", adminController_1.adminController.getAllUsers);
router.get("/dashboard-admin/:id", adminController_1.adminController.getUserById);
router.post("/dashboard-admin/create-admin", adminController_1.adminController.createAdmin);
router.post("/dashboard-admin/create-user", adminController_1.adminController.createUser);
router.patch("/dashboard-admin/:id", adminController_1.adminController.updateUser);
router.delete("/dashboard-admin/:id", adminController_1.adminController.deleteUser);
exports.default = router;
