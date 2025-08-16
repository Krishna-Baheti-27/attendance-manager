// src/services/attendanceService.js
import axios from "axios";

const API_URL = "http://localhost:3000/api/v1/attendance";

/**
 * Marks attendance for a specific subject.
 * @param {string} subjectId - The ID of the subject.
 * @param {string} status - The attendance status ('present' or 'absent').
 * @returns {Promise<object>} The data from the API response.
 */
// We no longer need the 'token' parameter
export const markAttendance = async (subjectId, status) => {
  const data = { status };

  try {
    // The config object is now much simpler
    const response = await axios.post(`${API_URL}/${subjectId}`, data, {
      withCredentials: true, // This tells axios to send the session cookie
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
