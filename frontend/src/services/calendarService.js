// src/services/calendarService.js
import axios from "axios";

const API_URL = "http://localhost:3000/api/v1/calendar";

/**
 * Fetches events from the user's Google Calendar.
 * @returns {Promise<Array>} The list of calendar events.
 */
export const getCalendarEvents = async () => {
  try {
    const response = await axios.get(`${API_URL}/events`, {
      withCredentials: true, // ensures cookies/session token are sent
    });
    // The backend returns { success: true, data: events }
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

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
    const response = await axios.post(`${API_URL}/schedule`, scheduleData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
