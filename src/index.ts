import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "../src/routes/auth";
import userRoutes from "./routes/user";
import adminRoutes from "./routes/admin";
import cors from "cors";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Express + TypeScript on Vercel!");
});

app.use("/auth", authRoutes);
app.use("/", userRoutes);
app.use("/", adminRoutes);

export default app;
