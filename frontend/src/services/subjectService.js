// src/services/subjectService.js
import axios from "axios";

const API_URL = "http://localhost:3000/api/v1/subjects";

export const getAllSubjects = async (token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  try {
    const response = await axios.get(API_URL, config);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Creates a new subject, optionally with initial attendance.
 * @param {string} name - The name of the new subject.
 * @param {string} token - The user's JWT token.
 * @param {string|number} initialAttended - The starting number of attended classes.
 * @param {string|number} initialTotal - The starting total number of classes.
 * @returns {Promise<object>} The newly created subject object with stats.
 */
export const createSubject = async (
  name,
  token,
  initialAttended,
  initialTotal
) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // Send all the data in the request body
  const data = { name, initialAttended, initialTotal };

  try {
    const response = await axios.post(API_URL, data, config);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
