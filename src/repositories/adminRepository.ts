import pool from "../config/db";
import bcrypt from "bcrypt";

async function getAllUsers() {
  const result = await pool.query(
    "SELECT id, username, email, role, status FROM users ORDER BY id ASC"
  );
  return result.rows;
}

async function getUserById(id: number) {
  const result = await pool.query(
    "SELECT id, username, email, role, status FROM users WHERE id = $1",
    [id]
  );
  return result.rows[0] || null;
}

async function createAdmin(username: string, email: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `INSERT INTO users (username, email, password, role, status) 
     VALUES ($1, $2, $3, 'admin', 'active') 
     RETURNING id, username, email, role, status`,
    [username, email, hashedPassword]
  );
  return result.rows[0];
}

async function createUser(username: string, email: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `INSERT INTO users (username, email, password, role, status) 
     VALUES ($1, $2, $3, 'user', 'active') 
     RETURNING id, username, email, role, status`,
    [username, email, hashedPassword]
  );
  return result.rows[0];
}

async function updateUser(
  id: number,
  fields: {
    username?: string;
    email?: string;
    password?: string;
    role?: string;
    status?: string;
  }
) {
  const values: any[] = [];
  const setClauses: string[] = [];
  let index = 1;

  if (fields.username) {
    setClauses.push(` username = $${index++}`);
    values.push(fields.username);
  }
  if (fields.email) {
    setClauses.push(` email = $${index++}`);
    values.push(fields.email);
  }
  if (fields.password) {
    const hashedPassword = await bcrypt.hash(fields.password, 10);
    setClauses.push(` password = $${index++}`);
    values.push(hashedPassword);
  }
  if (fields.role) {
    setClauses.push(` role = $${index++}`);
    values.push(fields.role);
  }
  if (fields.status) {
    setClauses.push(` status = $${index++}`);
    values.push(fields.status);
  }

  if (setClauses.length === 0) return null;

  const query = `UPDATE users SET ${setClauses.join(
    ","
  )} WHERE id = $${index} RETURNING id, username, email, role, status`;
  values.push(id);

  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

async function deleteUser(id: number) {
  const result = await pool.query(
    "DELETE FROM users WHERE id = $1 RETURNING id, username, email, role, status",
    [id]
  );
  return result.rows[0] || null;
}

async function findByEmail(email: string) {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return result.rows[0] || null;
}

export default {
  getAllUsers,
  getUserById,
  createAdmin,
  createUser,
  updateUser,
  deleteUser,
  findByEmail,
};
