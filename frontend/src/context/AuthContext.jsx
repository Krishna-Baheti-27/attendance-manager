// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // We now store the user object, not the token
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // This effect checks if a session already exists on page load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        // This new endpoint will check the session cookie and return the user
        const response = await axios.get(
          "http://localhost:3000/api/v1/auth/me",
          {
            withCredentials: true,
          }
        );
        setUser(response.data.user);
      } catch (error) {
        // If it fails, it just means no one is logged in
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkLoggedIn();
  }, []);

  // The login function now accepts a user object
  const login = (userData) => {
    setUser(userData);
  };

  // The logout function now calls the backend logout route
  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/v1/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
