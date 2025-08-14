import { protect } from "../middlewares/authMiddleware.js";
import {
  getAttendance,
  markAttendance,
} from "../controllers/attendanceController.js";
import express from "express";

const router = express.Router();

router
  .route("/:subjectId")
  .post(protect, markAttendance)
  .get(protect, getAttendance);

export default router;
