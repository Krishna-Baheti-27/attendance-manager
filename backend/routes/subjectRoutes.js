import express from "express";
const router = express.Router();

import { protect } from "../middlewares/authMiddleware.js";

import {
  getAllSubjects,
  createSubject,
} from "../controllers/subjectsController.js";

router.route("/").get(protect, getAllSubjects).post(protect, createSubject);

export default router;
