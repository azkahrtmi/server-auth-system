import pool from "../config/db";

export const adminRepository = {
  getAllUsers: async () => {
    return await pool.query(
      "SELECT id, username, email, role, status FROM users ORDER BY id ASC"
    );
  },

  getUserById: async (id: string) => {
    return await pool.query(
      "SELECT id, username, email, role, status FROM users WHERE id = $1",
      [id]
    );
  },

  getUserByEmail: async (email: string) => {
    return await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  },

  createUser: async (
    username: string,
    email: string,
    hashedPassword: string,
    role: string
  ) => {
    return await pool.query(
      `INSERT INTO users (username, email, password, role, status) 
       VALUES ($1, $2, $3, $4, 'active') 
       RETURNING id, username, email, role, status`,
      [username, email, hashedPassword, role]
    );
  },

  updateUser: async (query: string, values: any[]) => {
    return await pool.query(query, values);
  },

  deleteUser: async (id: string) => {
    return await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING id, username, email, role, status",
      [id]
    );
  },
};
