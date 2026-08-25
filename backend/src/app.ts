import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(helmet());
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.send("Tudo funcionando");
});

app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).send(error.message);
});

export default app;
