// src/pages/LoginPage.jsx
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import { loginUser } from "@/services/authService";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // We now get the 'user' object from the context, not the token
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // This effect now watches for the user object to change
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await loginUser({ email, password });

      // Check for the user object in the response data
      if (response.user) {
        // Pass the entire user object to the login function
        login(response.user);
      }
    } catch (err) {
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
