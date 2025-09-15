import bcrypt from "bcrypt";
import { adminRepository } from "../repositories/adminRepository";

export const adminService = {
  getAllUsers: async () => {
    const result = await adminRepository.getAllUsers();
    return result.rows;
  },

  getUserById: async (id: string) => {
    const result = await adminRepository.getUserById(id);
    if (result.rows.length === 0) throw new Error("User not found");
    return result.rows[0];
  },

  createUser: async (
    username: string,
    email: string,
    password: string,
    role: string
  ) => {
    if (!username || !email || !password) {
      throw new Error("All fields are required");
    }

    const existing = await adminRepository.getUserByEmail(email);
    if (existing.rows.length > 0) {
      throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await adminRepository.createUser(
      username,
      email,
      hashedPassword,
      role
    );
    return result.rows[0];
  },

  updateUser: async (id: string, data: any) => {
    const { username, email, password, role, status } = data;

    let query = "UPDATE users SET";
    const values: any[] = [];
    let setClauses: string[] = [];
    let index = 1;

    if (username) {
      setClauses.push(` username = $${index++}`);
      values.push(username);
    }
    if (email) {
      setClauses.push(` email = $${index++}`);
      values.push(email);
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      setClauses.push(` password = $${index++}`);
      values.push(hashedPassword);
    }
    if (role) {
      setClauses.push(` role = $${index++}`);
      values.push(role);
    }
    if (status) {
      setClauses.push(` status = $${index++}`);
      values.push(status);
    }

    if (setClauses.length === 0) throw new Error("No fields to update");

    query += setClauses.join(",");
    query += ` WHERE id = $${index} RETURNING id, username, email, role, status`;
    values.push(id);

    const result = await adminRepository.updateUser(query, values);
    if (result.rows.length === 0) throw new Error("User not found");
    return result.rows[0];
  },

  deleteUser: async (id: string, requesterId: number) => {
    if (requesterId === parseInt(id)) {
      throw new Error("You cannot delete your own account");
    }

    const result = await adminRepository.deleteUser(id);
    if (result.rows.length === 0) throw new Error("User not found");
    return result.rows[0];
  },
};
