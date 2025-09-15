import { findUserById, updateUser } from "../repositories/userRepository";

export async function getUserDashboard(id: number) {
  const user = await findUserById(id);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
}

export async function updateUserProfile(
  userIdFromToken: number,
  paramId: number,
  fields: { username?: string; email?: string }
) {
  if (userIdFromToken !== paramId) {
    throw new Error("Forbidden: Cannot edit other user");
  }

  const updateFields = { ...fields };

  const updatedUser = await updateUser(paramId, updateFields);

  if (!updatedUser) {
    throw new Error("No fields to update");
  }

  return updatedUser;
}
