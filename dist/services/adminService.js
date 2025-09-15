"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const adminRepository_1 = __importDefault(require("../repositories/adminRepository"));
async function getAllUsers() {
    return await adminRepository_1.default.getAllUsers();
}
async function getUserById(id) {
    return await adminRepository_1.default.getUserById(id);
}
async function createAdmin(username, email, password) {
    const existing = await adminRepository_1.default.findByEmail(email);
    if (existing)
        throw new Error("Email already exists");
    return await adminRepository_1.default.createAdmin(username, email, password);
}
async function createUser(username, email, password) {
    const existing = await adminRepository_1.default.findByEmail(email);
    if (existing)
        throw new Error("Email already exists");
    return await adminRepository_1.default.createUser(username, email, password);
}
async function updateUser(id, fields) {
    return await adminRepository_1.default.updateUser(id, fields);
}
async function deleteUser(id, currentUserId) {
    if (id === currentUserId)
        throw new Error("You cannot delete your own account");
    return await adminRepository_1.default.deleteUser(id);
}
exports.default = {
    getAllUsers,
    getUserById,
    createAdmin,
    createUser,
    updateUser,
    deleteUser,
};
