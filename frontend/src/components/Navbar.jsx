import { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="bg-black text-white px-4 py-3 shadow-md sticky top-0 z-50">
      <div className="flex justify-between items-center">
        {/* Brand */}
        <Link to="/" className="font-bold text-lg">
          Attend.<span className="text-green-400">ly</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden sm:flex items-center gap-8 font-medium">
          <Link to="/dashboard" className="hover:text-green-400 transition">
            Dashboard
          </Link>
          <Link to="/calendar" className="hover:text-green-400 transition">
            Calendar
          </Link>

          {user && (
            <div className="flex items-center gap-4 pl-6 border-l border-gray-700">
              {/* Avatar */}
              <div className="w-9 h-9 flex items-center justify-center rounded-full bg-green-500 font-bold text-sm">
                {user.name?.charAt(0).toUpperCase()}
              </div>

              {/* Name */}
              <span className="max-w-[120px] truncate">{user.name}</span>

              {/* Logout */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="bg-red-500 text-white font-medium py-2 px-3 rounded-lg shadow hover:bg-red-600 transition-colors"
              >
                Logout
              </motion.button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="sm:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="material-icons">menu</span>
        </button>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="sm:hidden mt-3 flex flex-col gap-3 pb-3"
          >
            <Link
              to="/dashboard"
              className="block px-2 py-2 rounded hover:bg-slate-800"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/calendar"
              className="block px-2 py-2 rounded hover:bg-slate-800"
              onClick={() => setIsOpen(false)}
            >
              Calendar
            </Link>

            {user && (
              <div className="flex items-center justify-between px-2">
                {/* Avatar + Name */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-500 font-bold text-sm">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span>{user.name}</span>
                </div>

                {/* Logout */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="bg-red-500 text-white font-semibold py-1 px-3 rounded-lg shadow hover:bg-red-600 transition-colors"
                >
                  Logout
                </motion.button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
