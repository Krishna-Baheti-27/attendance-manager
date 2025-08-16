// src/services/subjectService.js
import axios from "axios";

const API_URL = "http://localhost:3000/api/v1/subjects";

/**
 * Fetches all subjects for the logged-in user.
 */
export const getAllSubjects = async () => {
  try {
    // The only change is adding the 'withCredentials' option.
    // We no longer need to pass the token manually.
    const response = await axios.get(API_URL, {
      withCredentials: true, // This tells axios to send the session cookie
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Creates a new subject for the logged-in user.
 * @param {string} name - The name of the new subject.
 * @param {string|number} initialAttended - The starting number of attended classes.
 * @param {string|number} initialTotal - The starting total number of classes.
 */
export const createSubject = async (name, initialAttended, initialTotal) => {
  const data = { name, initialAttended, initialTotal };

  try {
    const response = await axios.post(API_URL, data, {
      withCredentials: true, // Also add it here
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
