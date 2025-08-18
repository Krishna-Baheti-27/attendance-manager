import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/attendance`;

export const markAttendance = async (subjectId, status, note) => {
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
