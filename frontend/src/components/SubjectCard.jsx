// src/components/SubjectCard.jsx
import { useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { markAttendance } from "@/services/attendanceService";

// The component now accepts 'todaysStatus' as a prop
function SubjectCard({ subject, todaysStatus }) {
  // --- THIS IS THE FIX ---
  // Initialize the 'isMarked' state based on the prop.
  // If 'todaysStatus' is 'present' or 'absent', it will be true. Otherwise, false.
  const [isMarked, setIsMarked] = useState(!!todaysStatus);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  // Also initialize the success message based on the prop
  const [successMessage, setSuccessMessage] = useState(
    todaysStatus ? `Marked as ${todaysStatus}` : ""
  );
  // --- END OF FIX ---

  const { token } = useContext(AuthContext);

  const handleMarkAttendance = async (status) => {
    if (!token) {
      setError("You must be logged in.");
      return;
    }

    try {
      await markAttendance(subject._id, status, token);
      setIsMarked(true);
      setSuccessMessage(`Marked as ${status}`);
    } catch (err) {
      const message = err.response?.data?.message || "An error occurred.";
      setError(message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-slate-800">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{subject.name}</h2>
        <div className="flex gap-4">
          <button
            onClick={() => handleMarkAttendance("present")}
            disabled={isMarked}
            className="bg-green-500 text-white font-bold py-2 px-4 rounded-md transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-green-600"
          >
            Present ✔️
          </button>
          <button
            onClick={() => handleMarkAttendance("absent")}
            disabled={isMarked}
            className="bg-red-500 text-white font-bold py-2 px-4 rounded-md transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-red-600"
          >
            Absent ❌
          </button>
        </div>
      </div>

      <div className="mt-4">
        {isMarked ? (
          <p
            className={`font-semibold ${
              successMessage.includes("absent")
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {successMessage}
          </p>
        ) : (
          <div>
            <label
              htmlFor={`note-${subject._id}`}
              className="block text-sm font-medium text-slate-600 mb-1"
            >
              Add a note (optional)
            </label>
            <textarea
              id={`note-${subject._id}`}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows="2"
              className="w-full bg-slate-50 border border-slate-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="e.g., Guest lecture today"
            />
          </div>
        )}
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
}

export default SubjectCard;
