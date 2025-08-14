import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext(null);

export const AuthProvider = function ({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Start with loading as true

  useEffect(function () {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      const decodedUser = jwtDecode(storedToken);
      setToken(storedToken);
      setUser(decodedUser);
    }
    setLoading(false);
  }, []);

  function login(newToken) {
    const decodedUser = jwtDecode(newToken);
    localStorage.setItem("token", newToken);
    setToken(token);
    setUser(decodedUser);
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
