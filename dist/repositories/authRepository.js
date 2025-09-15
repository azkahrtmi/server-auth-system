"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../config/db"));
async function findByEmail(email) {
    const result = await db_1.default.query("SELECT * FROM users WHERE email = $1", [
        email,
    ]);
    return result.rows[0] || null;
}
async function createUser(username, email, password) {
    const result = await db_1.default.query("INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, role, status", [username, email, password]);
    return result.rows[0];
}
async function login(email) {
    const result = await db_1.default.query("SELECT * FROM users WHERE email = $1", [
        email,
    ]);
    return result.rows[0];
}
async function findById(id) {
    const result = await db_1.default.query("SELECT id, username, email, role, status FROM users WHERE id = $1", [id]);
    return result.rows[0] || null;
}
exports.default = { findByEmail, createUser, login, findById };
