// routes/calendarRoutes.js
import express from "express";
import { createSchedule } from "../controllers/calendarController.js";
import { protect } from "../middlewares/authMiddleware.js"; // You'll need to create this middleware

const router = express.Router();

// This route will be protected. The 'protect' middleware will check
// if the user is logged in via session before running createSchedule.
router.post("/schedule", protect, createSchedule);

export default router;
