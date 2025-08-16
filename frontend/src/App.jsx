// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Header from "./components/Header";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import CalendarPage from "./pages/CalendarPage";

function App() {
  // Get the user and loading state from the context
  const { user, loading } = useContext(AuthContext);

  // If the context is still checking for a session, show a loading screen
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <Header />
      <main>
        <Routes>
          {user ? (
            // --- Routes accessible only when LOGGED IN ---
            <>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              {/* Redirect any other path to the dashboard */}
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </>
          ) : (
            // --- Routes accessible only when LOGGED OUT ---
            <>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              {/* Redirect any other path to the login page */}
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          )}
        </Routes>
      </main>
    </Router>
  );
}

export default App;
