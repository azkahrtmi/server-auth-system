"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const userController_1 = require("../controllers/userController");
const router = (0, express_1.Router)();
// ======================= GET USER PROFILE =======================
router.get("/dashboard-user", authMiddleware_1.verifyToken, userController_1.dashboardUser);
// ======================= UPDATE USER PROFILE =======================
router.patch("/dashboard-user/:id", authMiddleware_1.verifyToken, userController_1.updateUserController);
exports.default = router;
