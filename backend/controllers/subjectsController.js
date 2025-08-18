import Subject from "../models/subjectModel.js";
import Attendance from "../models/attendanceModel.js";

export async function createSubject(req, res) {
  try {
    const { name, initialAttended, initialTotal } = req.body;
    const userId = req.user._id;

    const subject = await Subject.create({
      name,
      user: userId,
    });

    // If initial attendance numbers are provided, create the historical records
    if (initialAttended > 0 || initialTotal > 0) {
      const attendedCount = Number(initialAttended) || 0;
      const totalCount = Number(initialTotal) || 0;
      const absentCount = totalCount - attendedCount;

      const attendanceRecords = [];
      const today = new Date();

      for (let i = 0; i < attendedCount; i++) {
        attendanceRecords.push({
          subject: subject._id,
          user: userId,
          status: "present",
          // Set a past date to avoid conflicts with future attendance
          date: new Date(new Date().setDate(today.getDate() - (i + 1))),
        });
      }

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

    const newSubjectWithStats = {
      _id: subject._id,
      name: subject.name,
      user: subject.user,
      attendedClasses: Number(initialAttended) || 0,
      totalClasses: Number(initialTotal) || 0,
      todaysStatus: null,
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

// Here we are not simply returning all the subjects of particular user but also returning the attendedClasses, totalClasses and todaysStatus so that our frontend does not have again send request to backend for getting data about each subject

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
