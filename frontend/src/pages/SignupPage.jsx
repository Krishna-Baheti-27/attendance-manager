import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import { signupUser } from "@/services/authService";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // If a user object exists, it means login/signup was successful, so redirect
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]); // fired according to changes in user and navigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // Call the API service
      const response = await signupUser({ name, email, password });

      // Check for the user object in the response
      if (response.user) {
        login(response.user);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Signup failed. Please try again.";
      setError(errorMessage);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white px-4">
      <div className="w-full max-w-sm border-2 border-neutral-800 bg-neutral-950 p-6 sm:p-8">
        <form onSubmit={handleSubmit}>
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold">Create Account</h1>
            <p className="text-neutral-400">
              Access your attendance dashboard.
            </p>
          </div>
          <div className="grid gap-6">
            <div className="grid gap-2">
              <label htmlFor="name" className="font-medium text-neutral-400">
                Name
              </label>
              <input
                id="name"
                type="name"
                placeholder="john"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-neutral-900 border border-neutral-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
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
          {error && (
            <p className="mt-4 text-center text-sm text-red-500">{error}</p>
          )}
          <div className="mt-8">
            <button
              type="submit"
              className="w-full bg-green-500 text-black font-bold py-3 hover:bg-green-600 transition-colors"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
