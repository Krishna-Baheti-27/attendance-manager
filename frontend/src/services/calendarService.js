// src/services/calendarService.js
import axios from "axios";

const API_URL = "http://localhost:3000/api/v1/calendar";

/**
 * Creates a recurring schedule in the user's Google Calendar.
 * @param {object} scheduleData - The details of the schedule.
 * @param {string} scheduleData.subjectId - The ID of the subject.
 * @param {Array<string>} scheduleData.days - The days of the week (e.g., ['MO', 'WE']).
 * @param {string} scheduleData.startTime - The start time (e.g., '10:00').
 * @param {string} scheduleData.endTime - The end time (e.g., '11:00').
 * @returns {Promise<object>} The response data from the API.
 */
export const createSchedule = async (scheduleData) => {
  try {
    // We use { withCredentials: true } to send the session cookie to the backend
    const response = await axios.post(`${API_URL}/schedule`, scheduleData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
