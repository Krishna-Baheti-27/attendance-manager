import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import CalendarPage from "./pages/CalendarPage";
import Navbar from "./components/Navbar";

function App() {
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
      <Navbar />
      <main>
        <Routes>
          {user ? (
            <>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </>
          ) : (
            <>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          )}
        </Routes>
      </main>
    </Router>
  );
}

export default App;
