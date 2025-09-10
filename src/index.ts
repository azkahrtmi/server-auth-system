import express, { Request, Response } from "express";
import dotenv from "dotenv";
import authRoutes from "../src/routes/auth";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello Express with TypeScript!");
});

app.use(express.json());
app.use("/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
