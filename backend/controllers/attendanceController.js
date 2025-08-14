import { success } from "zod";
import Attendance from "../models/attendanceModel.js";

export async function markAttendance(req, res) {
  try {
    const { status } = req.body;
    const subject = req.params.subjectId;
    const user = req.user._id;

    // check if user has already marked attendance, if yes then dont allow them
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const existingAttendance = await Attendance.findOne({
      user,
      subject,
      date: { $gte: todayStart, $lt: todayEnd },
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: "Attendance has already been marked for this subject today",
      });
    }

    const attendanceData = await Attendance.create({
      subject,
      user,
      date: new Date(),
      status,
    });
    res.status(201).json({
      success: "true",
      data: attendanceData,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function getAttendance(req, res) {
  try {
    const subject = req.params.subjectId;
    const user = req.user._id;
    const attendanceData = await Attendance.find({
      subject,
      user,
    });
    res.status(200).json({
      success: true,
      data: attendanceData,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
