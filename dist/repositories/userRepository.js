"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserById = findUserById;
exports.updateUser = updateUser;
const db_1 = __importDefault(require("../config/db"));
async function findUserById(id) {
    const result = await db_1.default.query("SELECT id, username, email, role, status FROM users WHERE id = $1", [id]);
    return result.rows[0] || null;
}
async function updateUser(id, fields) {
    let query = "UPDATE users SET";
    const values = [];
    const setClauses = [];
    let index = 1;
    if (fields.username) {
        setClauses.push(` username = $${index++}`);
        values.push(fields.username);
    }
    if (fields.email) {
        setClauses.push(` email = $${index++}`);
        values.push(fields.email);
    }
    if (setClauses.length === 0) {
        return null; // tidak ada field yang diupdate
    }
    query += setClauses.join(",");
    query += ` WHERE id = $${index} RETURNING id, username, email, role, status`;
    values.push(id);
    const result = await db_1.default.query(query, values);
    return result.rows[0];
}
