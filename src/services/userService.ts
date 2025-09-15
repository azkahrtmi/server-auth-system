import { findUserById } from "../repositories/userRepository";

export async function getUserDashboard(id: number) {
  const user = await findUserById(id);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
}
