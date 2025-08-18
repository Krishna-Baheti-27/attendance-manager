import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/calendar`;

export const getCalendarEvents = async () => {
  try {
    const response = await axios.get(`${API_URL}/events`, {
      withCredentials: true,
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

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
