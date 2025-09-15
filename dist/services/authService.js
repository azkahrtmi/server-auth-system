"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authRepository_1 = __importDefault(require("../repositories/authRepository"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
async function register(username, email, password) {
    // cek email apakah sudah ada
    const existingUser = await authRepository_1.default.findByEmail(email);
    if (existingUser) {
        throw new Error("Email already registered");
    }
    // hash password
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    // simpan user baru
    const user = await authRepository_1.default.createUser(username, email, hashedPassword);
    return { user };
}
async function login(email, password) {
    // cari user
    const user = await authRepository_1.default.login(email);
    if (!user) {
        throw new Error("Invalid credentials");
    }
    // cek password
    const validPassword = await bcrypt_1.default.compare(password, user.password);
    if (!validPassword) {
        throw new Error("Invalid credentials");
    }
    // generate token
    const options = {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    };
    const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, options);
    return {
        token,
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
        },
    };
}
async function getProfile(token) {
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    const user = await authRepository_1.default.findById(decoded.id);
    if (!user) {
        throw new Error("User not found");
    }
    return user;
}
exports.default = { register, login, getProfile };
