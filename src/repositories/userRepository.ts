import pool from "../config/db";

export async function findUserById(id: number) {
  const result = await pool.query(
    "SELECT id, username, email, role, status FROM users WHERE id = $1",
    [id]
  );
  return result.rows[0] || null;
}

export async function updateUser(
  id: number,
  fields: { username?: string; email?: string }
) {
  let query = "UPDATE users SET";
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

  if (setClauses.length === 0) {
    return null; // tidak ada field yang diupdate
  }

  query += setClauses.join(",");
  query += ` WHERE id = $${index} RETURNING id, username, email, role, status`;
  values.push(id);

  const result = await pool.query(query, values);
  return result.rows[0];
}
