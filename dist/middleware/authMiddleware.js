"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRoles = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// ======================= VERIFY TOKEN =======================
const verifyToken = (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // inject user info
        next();
    }
    catch (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};
exports.verifyToken = verifyToken;
// ======================= CHECK ROLES =======================
const checkRoles = (roles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!roles.includes(user.role)) {
            return res.status(403).json({ message: "Forbidden: Insufficient role" });
        }
        next();
    };
};
exports.checkRoles = checkRoles;
