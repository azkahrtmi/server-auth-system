import pool from "../config/db";

export async function findUserById(id: number) {
  const result = await pool.query(
    "SELECT id, username, email, role, status FROM users WHERE id = $1",
    [id]
  );
  return result.rows[0] || null;
}
