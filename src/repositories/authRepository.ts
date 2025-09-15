import { Result } from "pg";
import pool from "../config/db";

async function findByEmail(email: string) {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return result.rows[0] || null;
}

async function createUser(username: string, email: string, password: string) {
  const result = await pool.query(
    "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, role, status",
    [username, email, password]
  );
  return result.rows[0];
}

async function login(email: string) {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  return result.rows[0];
}

async function findById(id: number) {
  const result = await pool.query(
    "SELECT id, username, email, role, status FROM users WHERE id = $1",
    [id]
  );
  return result.rows[0];
}

export default { findByEmail, createUser, login, findById };
