// src/services/subjectService.js
import axios from "axios";

// The base URL for your backend API
const API_URL = "http://localhost:3000/api/v1/subjects";

/**
 * Fetches all subjects for the logged-in user.
 * @param {string} token - The user's JWT token.
 * @returns {Promise<Array>} The array of subjects.
 */
export const getAllSubjects = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.get(API_URL, config);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Creates a new subject for the logged-in user.
 * @param {string} name - The name of the new subject.
 * @param {string} token - The user's JWT token.
 * @returns {Promise<object>} The newly created subject object.
 */
export const createSubject = async (name, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // The data to be sent in the request body
  const data = { name };

  try {
    const response = await axios.post(API_URL, data, config);
    // The new subject is in response.data.data
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
