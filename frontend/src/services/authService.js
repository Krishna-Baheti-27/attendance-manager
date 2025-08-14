import axios from "axios";

export const loginUser = async ({ email, password }) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/v1/auth/login",
      {
        email,
        password,
      }
    );
    return response.data;
  } catch (err) {
    console.log("Login failed");
    throw err;
  }
};

export const signupUser = async ({ name, email, password }) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/v1/auth/signup",
      {
        name,
        email,
        password,
      }
    );
    return response.data;
  } catch (err) {
    console.log("Signup failed");
    throw err;
  }
};
