// controllers/calendarController.js
import { google } from "googleapis";
import Subject from "../models/subjectModel.js";

// This is the main function that will create the event
export const createSchedule = async (req, res) => {
  try {
    // 1. Get the necessary data
    // The user object is attached by our session middleware
    const user = req.user;
    const { subjectId, days, startTime, endTime } = req.body;

    // 2. Check if we have the required Google tokens
    if (!user.googleAccessToken) {
      return res.status(400).json({ message: "Google account not connected." });
    }

    // 3. Find the subject to get its name
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found." });
    }

    // 4. Set up the Google API client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      "/api/v1/auth/google/callback" // Your redirect URI
    );
    // Set the user's tokens for this request
    oauth2Client.setCredentials({
      access_token: user.googleAccessToken,
      refresh_token: user.googleRefreshToken,
    });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    // 5. Construct the event object for Google Calendar
    const event = {
      summary: subject.name, // This is the title of the event
      description: "Class for Attend.ly attendance tracking.",
      start: {
        // We need a full date-time string, so we find the next upcoming class day
        dateTime: getNextDateTime(days[0], startTime),
        timeZone: "Asia/Kolkata", // You can make this dynamic later
      },
      end: {
        dateTime: getNextDateTime(days[0], endTime),
        timeZone: "Asia/Kolkata",
      },
      // This is the magic part: the recurrence rule
      recurrence: [
        `RRULE:FREQ=WEEKLY;BYDAY=${days.join(",")}`, // e.g., "RRULE:FREQ=WEEKLY;BYDAY=MO,WE,FR"
      ],
      // Add a 30-minute reminder
      reminders: {
        useDefault: false,
        overrides: [{ method: "popup", minutes: 30 }],
      },
    };

    // 6. Insert the event into the user's primary calendar
    await calendar.events.insert({
      calendarId: "primary",
      resource: event,
    });

    res
      .status(201)
      .json({ success: true, message: "Schedule created successfully!" });
  } catch (error) {
    console.error("Error creating calendar event:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to create schedule." });
  }
};

// Helper function to get the correct date-time for the first event
function getNextDateTime(dayOfWeek, time) {
  const [hour, minute] = time.split(":");
  const now = new Date();
  const dayMap = { MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6, SU: 0 };
  const targetDay = dayMap[dayOfWeek];

  let resultDate = new Date();
  resultDate.setDate(now.getDate() + ((targetDay - now.getDay() + 7) % 7));
  resultDate.setHours(hour, minute, 0, 0);

  // If the calculated time is in the past, move to the next week
  if (resultDate < now) {
    resultDate.setDate(resultDate.getDate() + 7);
  }

  return resultDate.toISOString();
}
