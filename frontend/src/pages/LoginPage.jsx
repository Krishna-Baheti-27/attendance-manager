// src/pages/LoginPage.jsx
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import { loginUser } from "@/services/authService";

export default function LoginPage() {
  // State for the form inputs and for displaying errors
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  // Get the login function from our global AuthContext
  const { login, token } = useContext(AuthContext);
  // Get the navigate function from react-router to redirect the user
  const navigate = useNavigate();

  useEffect(() => {
    // If a token exists, it means the user is logged in, so we redirect.
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  // This function runs when the form is submitted
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission (page reload)
    setError(""); // Clear any previous errors

    try {
      // Step 1: Call the API service with the user's email and password
      const data = await loginUser({ email, password });

      // Step 2: If the API call is successful, the 'data' will contain our token.
      // We call the 'login' function from our AuthContext with this token.
      // This will update the global state and save the token to localStorage.
      if (data.token) {
        login(data.token);
        // Step 3: Redirect the user to their dashboard.
      }
    } catch (err) {
      // Step 4: If the API call fails (e.g., wrong password), the authService
      // throws an error. We catch it here.
      // The error from axios contains the backend's response.
      const errorMessage =
        err.response?.data?.message || "Login failed. Please try again.";
      setError(errorMessage);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white px-4">
      <div className="w-full max-w-sm border-2 border-neutral-800 bg-neutral-950 p-6 sm:p-8">
        <form onSubmit={handleSubmit}>
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold">Sign In</h1>
            <p className="text-neutral-400">
              Access your attendance dashboard.
            </p>
          </div>
          <div className="grid gap-6">
            <div className="grid gap-2">
              <label htmlFor="email" className="font-medium text-neutral-400">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-neutral-900 border border-neutral-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="grid gap-2">
              <label
                htmlFor="password"
                className="font-medium text-neutral-400"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-neutral-900 border border-neutral-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          {/* Display the error message if one exists */}
          {error && (
            <p className="mt-4 text-center text-sm text-red-500">{error}</p>
          )}
          <div className="mt-8">
            <button
              type="submit"
              className="w-full bg-green-500 text-black font-bold py-3 hover:bg-green-600 transition-colors"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
