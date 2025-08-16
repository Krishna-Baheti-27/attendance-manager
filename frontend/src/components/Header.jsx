import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";

function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // This function handles the logout process
  function handleLogout() {
    logout(); // Clears the token from context and localStorage
    navigate("/login"); // Redirects to the login page
  }

  return (
    <header className="bg-neutral-950 border-b border-neutral-800 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto flex items-center justify-between h-16">
        {/* App Logo/Name */}
        <Link to="/" className="text-xl font-bold text-white">
          Attend.ly
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-4">
          {user ? (
            // If a token exists, show the Logout button
            <button
              onClick={handleLogout}
              className="bg-neutral-800 text-white font-semibold py-2 px-4 hover:bg-neutral-700 transition-colors"
            >
              Logout
            </button>
          ) : (
            // If no token, show Sign In and Sign Up
            <>
              <Link
                to="/login"
                className="text-neutral-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-green-500 text-black font-bold py-2 px-4 hover:bg-green-600 transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
