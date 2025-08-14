import express from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();

// Common middlewares

app.use(express.json());
app.use(cors());
app.use(morgan("dev")); // to see all requests in the console

// Routers
import subjectRouter from "./routes/subjectRoutes.js";
import signupRouter from "./routes/authRoutes.js";
import attendanceRouter from "./routes/attendanceRoute.js";

// Routes
app.use("/api/v1/subjects", subjectRouter);
app.use("/api/v1/auth", signupRouter);
app.use("/api/v1/attendance", attendanceRouter);

export default app;
