import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/auth`;

export const loginUser = async ({ email, password }) => {
  try {
    const response = await axios.post(
      `${API_URL}/login`,
      { email, password },
      { withCredentials: true } // Send the session cookie
    );
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const signupUser = async ({ name, email, password }) => {
  try {
    const response = await axios.post(
      `${API_URL}/signup`,
      { name, email, password },
      { withCredentials: true }
    );
    return response.data;
  } catch (err) {
    throw err;
  }
};
