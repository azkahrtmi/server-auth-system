"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = require("express");
const authController_1 = __importDefault(require("../controllers/authController"));
dotenv_1.default.config();
const router = (0, express_1.Router)();
// ======================= REGISTER =======================
router.post("/signup", authController_1.default.register);
// ======================= LOGIN =======================
router.post("/signin", authController_1.default.login);
// ======================= PROFILE =======================
router.get("/profile", authController_1.default.getProfile);
// ======================= LOGOUT =======================
router.post("/signout", authController_1.default.logout);
exports.default = router;
