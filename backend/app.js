// app.js
import express from "express";
import cors from "cors";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import { configurePassport } from "./config/passport-config.js"; // Assuming config is in the root

import dotenv from "dotenv";

dotenv.config();

const app = express();

// Initialize Passport with our Google strategy
configurePassport(passport);

// --- Middleware Setup ---
app.use(express.json());
// Configure CORS to allow credentials (cookies) from your frontend
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(morgan("dev"));

// --- Session Middleware (must come BEFORE Passport) ---
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Add a SESSION_SECRET to your .env file
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URL }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    },
  })
);

// --- Passport Middleware (must come AFTER Session) ---
app.use(passport.initialize());
app.use(passport.session());

// --- Routers ---
import subjectRouter from "./routes/subjectRoutes.js";
import authRouter from "./routes/authRoutes.js"; // Renamed for clarity
import attendanceRouter from "./routes/attendanceRoute.js";
import calendarRouter from "./routes/calendarRoutes.js";

// --- Routes ---
app.use("/api/v1/subjects", subjectRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/attendance", attendanceRouter);
app.use("/api/v1/calendar", calendarRouter);

export default app;
