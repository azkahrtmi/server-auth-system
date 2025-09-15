import authRepository from "../repositories/authRepository";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";

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

async function login(email: string, password: string) {
  // cari user
  const user = await authRepository.login(email);
  if (!user) {
    throw new Error("Invalid credentials");
  }

  // cek password
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new Error("Invalid credentials");
  }

  // generate token
  const options: SignOptions = {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  } as SignOptions;
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET as string,
    options
  );

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  };
}

async function getProfile(token: string) {
  const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
    id: string;
    role: string;
  };

  const user = await authRepository.findById;
  decoded.id;
  if (!user) {
    throw new Error("User not found");
  }
  return user;
}

export default { register, login, getProfile };
