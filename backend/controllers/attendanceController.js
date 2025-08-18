import Attendance from "../models/attendanceModel.js";
import Subject from "../models/subjectModel.js";
import { google } from "googleapis";

export async function markAttendance(req, res) {
  try {
    const { status, note } = req.body;
    const subjectId = req.params.subjectId;
    const user = req.user;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const existingAttendance = await Attendance.findOne({
      user: user._id,
      subject: subjectId,
      date: { $gte: todayStart, $lt: todayEnd },
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: "Attendance has already been marked for this subject today.",
      });
    }

    // save attendance data
    const attendanceData = await Attendance.create({
      subject: subjectId,
      user: user._id,
      date: new Date(),
      status,
      note,
    });

    // update to google calendar
    // Only proceed if the user has a Google account connected and provided a note
    if (user.googleAccessToken && note) {
      const subject = await Subject.findById(subjectId);
      if (!subject) {
        return res.status(201).json({
          success: true,
          data: attendanceData,
          message:
            "Local attendance saved, but subject not found for calendar update.",
        });
      }

      // create new google oauth client
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        "/api/v1/auth/google/callback"
      );
      // set the credentials of the client to be same as that of current user
      oauth2Client.setCredentials({
        access_token: user.googleAccessToken,
        refresh_token: user.googleRefreshToken,
      });

      const calendar = google.calendar({ version: "v3", auth: oauth2Client });

      // Find today's specific instance of the recurring event
      // Note : actual recurring event is created by calendarController.js, here we are just finding that event for marking attendance
      const events = await calendar.events.list({
        calendarId: "primary",
        q: subject.name, // search for the event in user's calendar having title same as subject name
        timeMin: todayStart.toISOString(),
        timeMax: todayEnd.toISOString(),
        singleEvents: true, // expands recurring events into single instances
      });

      if (events.data.items.length > 0) {
        const eventToUpdate = events.data.items[0];

        // If the event is found then update the event's description with the note
        await calendar.events.patch({
          calendarId: "primary",
          eventId: eventToUpdate.id,
          requestBody: {
            description: `Attendance Status: ${status.toUpperCase()}\nNote: ${note}`,
            // here we reflect our actual status, that user has given
          },
        });
      }
    }

    res.status(201).json({ success: true, data: attendanceData });
  } catch (error) {
    console.error("Error in markAttendance:", error);
    res.status(500).json({ success: false, message: "Server Error" });
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
