// controllers/subjectsController.js
import Subject from "../models/subjectModel.js";
import Attendance from "../models/attendanceModel.js";

export async function createSubject(req, res) {
  try {
    const { name, initialAttended, initialTotal } = req.body;
    const userId = req.user._id;

    // 1. Create the new subject
    const subject = await Subject.create({
      name,
      user: userId,
    });

    // 2. If initial attendance numbers are provided, create the historical records
    if (initialAttended > 0 || initialTotal > 0) {
      const attendedCount = Number(initialAttended) || 0;
      const totalCount = Number(initialTotal) || 0;
      const absentCount = totalCount - attendedCount;

      const attendanceRecords = [];
      const today = new Date();

      // Create "present" records with past dates
      for (let i = 0; i < attendedCount; i++) {
        attendanceRecords.push({
          subject: subject._id,
          user: userId,
          status: "present",
          // Set a past date to avoid conflicts with future attendance
          date: new Date(new Date().setDate(today.getDate() - (i + 1))),
        });
      }

      // Create "absent" records with past dates
      for (let i = 0; i < absentCount; i++) {
        attendanceRecords.push({
          subject: subject._id,
          user: userId,
          status: "absent",
          date: new Date(
            new Date().setDate(today.getDate() - (attendedCount + i + 1))
          ),
        });
      }

      // Insert all records into the database in one efficient operation
      if (attendanceRecords.length > 0) {
        await Attendance.insertMany(attendanceRecords);
      }
    }

    // 3. Return the new subject with its stats pre-calculated
    // This ensures the UI updates correctly without needing a refresh
    const newSubjectWithStats = {
      _id: subject._id,
      name: subject.name,
      user: subject.user,
      attendedClasses: Number(initialAttended) || 0,
      totalClasses: Number(initialTotal) || 0,
      todaysStatus: null, // It's a new subject, so no status for today
    };

    return res.status(201).json({
      success: true,
      data: newSubjectWithStats,
    });
  } catch (error) {
    console.error("Error in createSubject:", error);
    res
      .status(400)
      .json({ success: false, message: "Failed to create subject" });
  }
}

// The getAllSubjects function remains the same as before
export async function getAllSubjects(req, res) {
  try {
    const userId = req.user._id;

    const subjectsWithStats = await Subject.aggregate([
      { $match: { user: userId } },
      {
        $lookup: {
          from: "attendances",
          localField: "_id",
          foreignField: "subject",
          as: "attendanceRecords",
        },
      },
      {
        $project: {
          name: 1,
          user: 1,
          createdAt: 1,
          updatedAt: 1,
          totalClasses: {
            $size: {
              $filter: {
                input: "$attendanceRecords",
                as: "att",
                cond: { $in: ["$$att.status", ["present", "absent"]] },
              },
            },
          },
          attendedClasses: {
            $size: {
              $filter: {
                input: "$attendanceRecords",
                as: "att",
                cond: { $eq: ["$$att.status", "present"] },
              },
            },
          },
          todaysStatus: {
            $let: {
              vars: {
                todayRecord: {
                  $filter: {
                    input: "$attendanceRecords",
                    as: "att",
                    cond: {
                      $and: [
                        {
                          $gte: [
                            "$$att.date",
                            new Date(new Date().setHours(0, 0, 0, 0)),
                          ],
                        },
                        {
                          $lt: [
                            "$$att.date",
                            new Date(new Date().setHours(23, 59, 59, 999)),
                          ],
                        },
                      ],
                    },
                  },
                },
              },
              in: { $arrayElemAt: ["$$todayRecord.status", 0] },
            },
          },
        },
      },
    ]);

    return res.json({
      success: true,
      data: subjectsWithStats,
    });
  } catch (error) {
    console.error("Error fetching subjects with stats:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}
