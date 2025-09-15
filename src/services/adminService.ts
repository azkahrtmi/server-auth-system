import adminRepository from "../repositories/adminRepository";

async function getAllUsers() {
  return await adminRepository.getAllUsers();
}

async function getUserById(id: number) {
  return await adminRepository.getUserById(id);
}

async function createAdmin(username: string, email: string, password: string) {
  const existing = await adminRepository.findByEmail(email);
  if (existing) throw new Error("Email already exists");
  return await adminRepository.createAdmin(username, email, password);
}

async function createUser(username: string, email: string, password: string) {
  const existing = await adminRepository.findByEmail(email);
  if (existing) throw new Error("Email already exists");
  return await adminRepository.createUser(username, email, password);
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
  return await adminRepository.updateUser(id, fields);
}

async function deleteUser(id: number, currentUserId: number) {
  if (id === currentUserId)
    throw new Error("You cannot delete your own account");
  return await adminRepository.deleteUser(id);
}

export default {
  getAllUsers,
  getUserById,
  createAdmin,
  createUser,
  updateUser,
  deleteUser,
};
