import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/subjects`;

export const getAllSubjects = async () => {
  try {
    const response = await axios.get(API_URL, {
      withCredentials: true,
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const createSubject = async (name, initialAttended, initialTotal) => {
  const data = { name, initialAttended, initialTotal };

  try {
    const response = await axios.post(API_URL, data, {
      withCredentials: true,
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
