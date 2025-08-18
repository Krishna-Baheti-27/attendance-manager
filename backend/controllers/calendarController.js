import { google } from "googleapis";
import Subject from "../models/subjectModel.js";

function parseDescription(desc = "") {
  const out = { status: undefined, note: "" };
  if (!desc) return out;

  // Try to find "Attendance Status: PRESENT/ABSENT"
  const statusMatch = desc.match(/attendance\s*status:\s*(present|absent)/i);
  if (statusMatch) out.status = statusMatch[1].toLowerCase();

  // Try to find "Note: <anything to end>"
  const noteMatch = desc.match(/note:\s*(.+)/i);
  if (noteMatch) out.note = noteMatch[1].trim();

  return out;
}

// creating the event
export const createSchedule = async (req, res) => {
  try {
    const user = req.user;
    const { subjectId, days, startTime, endTime, status, note } = req.body;

    if (!user?.googleAccessToken) {
      return res.status(400).json({ message: "Google account not connected." });
    }

    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found." });
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      "/api/v1/auth/google/callback"
    );
    oauth2Client.setCredentials({
      access_token: user.googleAccessToken,
      refresh_token: user.googleRefreshToken,
    });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const event = {
      summary: subject.name,
      description: "Class for Attend.ly attendance tracking.",
      start: {
        dateTime: getNextDateTime(days[0], startTime),
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: getNextDateTime(days[0], endTime),
        timeZone: "Asia/Kolkata",
      },
      recurrence: [`RRULE:FREQ=WEEKLY;BYDAY=${days.join(",")}`],
      reminders: {
        useDefault: false,
        overrides: [{ method: "popup", minutes: 30 }],
      },
      extendedProperties: {
        private: {
          status: (status || "present").toLowerCase(),
          note: note || "",
        },
      },
    };

    // creating actual calendar event
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

function getNextDateTime(dayOfWeek, time) {
  const [hour, minute] = time.split(":");
  const now = new Date();
  const dayMap = { MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6, SU: 0 };
  const targetDay = dayMap[dayOfWeek];

  let resultDate = new Date();
  resultDate.setDate(now.getDate() + ((targetDay - now.getDay() + 7) % 7));
  resultDate.setHours(hour, minute, 0, 0);

  if (resultDate < now) {
    resultDate.setDate(resultDate.getDate() + 7);
  }

  return resultDate.toISOString();
}

// list the events
export const getCalendarEvents = async (req, res) => {
  try {
    const user = req.user;
    if (!user?.googleAccessToken) {
      return res.status(400).json({ message: "Google account not connected." });
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      "/api/v1/auth/google/callback"
    );
    oauth2Client.setCredentials({
      access_token: user.googleAccessToken,
      refresh_token: user.googleRefreshToken,
    });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date(
        new Date().setMonth(new Date().getMonth() - 1)
      ).toISOString(),
      timeMax: new Date(
        new Date().setMonth(new Date().getMonth() + 1)
      ).toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = (response.data.items || []).map((event) => {
      const desc = event.description || "";
      const metaStatus =
        event.extendedProperties?.private?.status?.toLowerCase();
      const metaNote = event.extendedProperties?.private?.note || "";
      const parsed = parseDescription(desc);

      // if meta data fails then go to parsed
      const status = metaStatus || parsed.status || null;
      const note = metaNote || parsed.note || "";

      return {
        id: event.id,
        title: event.summary,
        start: event.start?.dateTime || event.start?.date,
        end: event.end?.dateTime || event.end?.date,
        description: desc,
        status, // "present" | "absent" | null
        note,
      };
    });

    res.status(200).json({ success: true, data: events });
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch events." });
  }
};
