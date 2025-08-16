// src/services/authService.js
import axios from "axios";

const API_URL = "http://localhost:3000/api/v1/auth";

// This function now expects the user object in the response
export const loginUser = async ({ email, password }) => {
  try {
    const response = await axios.post(
      `${API_URL}/login`,
      { email, password },
      { withCredentials: true } // Send the session cookie
    );
    return response.data; // Return the whole response data (e.g., { success: true, user: {...} })
  } catch (err) {
    throw err;
  }
};

// This function also needs to be updated
export const signupUser = async ({ name, email, password }) => {
  try {
    const response = await axios.post(
      `${API_URL}/signup`,
      { name, email, password },
      { withCredentials: true } // Send the session cookie
    );
    return response.data;
  } catch (err) {
    throw err;
  }
};
