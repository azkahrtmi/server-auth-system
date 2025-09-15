import authRepository from "../repositories/authRepository";
import bcrypt from "bcrypt";

async function register(username: string, email: string, password: string) {
  // cek email apakah sudah ada
  const existingUser = await authRepository.findByEmail(email);
  if (existingUser) {
    throw new Error("Email already registered");
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // simpan user baru
  const user = await authRepository.createUser(username, email, hashedPassword);

  return { user };
}
export default { register };
