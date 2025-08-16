// controllers/subjectsController.js
import Subject from "../models/subjectModel.js";
import Attendance from "../models/attendanceModel.js"; // 1. Import the Attendance model

export async function createSubject(req, res) {
  try {
    const { name } = req.body;
    const userId = req.user._id;
    const subject = await Subject.create({
      name,
      user: userId,
    });
    // Send back the newly created subject
    return res.status(201).json({
      success: true,
      data: subject,
    });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Failed to create subject" });
  }
}

export async function getAllSubjects(req, res) {
  try {
    // Get all subjects for the user
    const subjects = await Subject.find({
      user: req.user._id,
    }).lean(); // Use .lean() for better performance

    // --- This is the new logic to fix the refresh issue ---
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Find all of today's attendance records for this user in one go
    const todaysAttendances = await Attendance.find({
      user: req.user._id,
      date: { $gte: todayStart, $lt: todayEnd },
    });

    // Map the attendance records to their subject IDs for easy lookup
    const attendanceMap = new Map();
    todaysAttendances.forEach((att) => {
      attendanceMap.set(att.subject.toString(), att.status);
    });

    // Add the 'todaysStatus' to each subject
    const subjectsWithStatus = subjects.map((subject) => {
      return {
        ...subject,
        todaysStatus: attendanceMap.get(subject._id.toString()) || null,
      };
    });
    // --- End of new logic ---

    return res.json({
      success: true,
      data: subjectsWithStatus, // Send back the combined data
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
}
