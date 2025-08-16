// routes/calendarRoutes.js
import express from "express";
import {
  createSchedule,
  getCalendarEvents,
} from "../controllers/calendarController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route to create a new recurring schedule
// POST /api/v1/calendar/schedule
router.post("/schedule", protect, createSchedule);

// Route to get all calendar events for the user
// GET /api/v1/calendar/events
router.get("/events", protect, getCalendarEvents);

export default router;
