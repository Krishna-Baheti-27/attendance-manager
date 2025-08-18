import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import { configurePassport } from "./config/passport-config.js";

const app = express();

configurePassport(passport);

app.set("trust proxy", 1);

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(morgan("dev"));

// Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URL }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days

      // These settings are required for cross-domain cookies
      sameSite: "none",
      secure: true,
    },
  })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Routers
import subjectRouter from "./routes/subjectRoutes.js";
import authRouter from "./routes/authRoutes.js";
import attendanceRouter from "./routes/attendanceRoute.js";
import calendarRouter from "./routes/calendarRoutes.js";

// Routes
app.use("/api/v1/subjects", subjectRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/attendance", attendanceRouter);
app.use("/api/v1/calendar", calendarRouter);

export default app;
