// src/services/attendanceService.js
import axios from "axios";

// The base URL for the attendance endpoint
const API_URL = "http://localhost:3000/api/v1/attendance";

/**
 * Marks attendance for a specific subject.
 * @param {string} subjectId - The ID of the subject.
 * @param {string} status - The attendance status ('present' or 'absent').
 * @param {string} token - The user's JWT token.
 * @returns {Promise<object>} The data from the API response.
 */
export const markAttendance = async (subjectId, status, token) => {
  // 1. The data (request body) is the first argument after the URL.
  const data = { status };

  // 2. The config (with headers) is the third argument.
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    // 3. The URL needs a '/' before the subjectId.
    // 4. The axios call MUST be awaited.
    const response = await axios.post(`${API_URL}/${subjectId}`, data, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};
