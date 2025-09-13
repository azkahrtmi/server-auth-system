import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "../src/routes/auth";
import userRoutes from "./routes/user";
import adminRoutes from "./routes/admin";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello Express with TypeScript!");
});

app.use("/auth", authRoutes);
app.use("/", userRoutes);
app.use("/", adminRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
