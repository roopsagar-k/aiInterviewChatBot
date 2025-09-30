import express from "express";
import routes from "./routes";
import cors from "cors";
import ApiError from "./utils/api-error";
import { Request, Response, NextFunction } from "express";

export const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.send("<h1>Swipe Assignment...</h1>");
});

app.use("/api", routes);

app.use((err: ApiError, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  console.error({
    success: false,
    message: err.message,
    errors: err.errors || [],
  });
  res.status(statusCode).json({
    success: false,
    message: err.message,
    errors: err.errors || [],
  });
});
