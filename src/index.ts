import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "./config/app.config";

const app = express();
const BASE_PATH = config.BASE_PATH;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: config.APP_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Health check successful",
  });
});

app.listen(config.PORT, () => {
  console.log(`Server listening on port ${config.PORT}`);
});
