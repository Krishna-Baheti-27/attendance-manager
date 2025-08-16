// src/services/attendanceService.js
import axios from "axios";

const API_URL = "http://localhost:3000/api/v1/attendance";

/**
 * Marks attendance for a specific subject.
 * @param {string} subjectId - The ID of the subject.
 * @param {string} status - The attendance status ('present' or 'absent').
 * @param {string} note - The optional note for the attendance.
 * @returns {Promise<object>} The data from the API response.
 */
// Add the 'note' parameter
export const markAttendance = async (subjectId, status, note) => {
  // Include the note in the request body
  const data = { status, note };

  try {
    const response = await axios.post(`${API_URL}/${subjectId}`, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
