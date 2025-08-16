// src/components/SubjectCard.jsx
import { useState } from "react";
import { markAttendance } from "@/services/attendanceService";

function SubjectCard({ subject, todaysStatus, onAttendanceUpdate }) {
  const [isMarked, setIsMarked] = useState(!!todaysStatus);
  const [note, setNote] = useState(""); // This state will hold the note
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(
    todaysStatus ? `Marked as ${todaysStatus}` : ""
  );

  const percentage =
    subject.totalClasses > 0
      ? ((subject.attendedClasses / subject.totalClasses) * 100).toFixed(0)
      : 0;

  const handleMarkAttendance = async (status) => {
    try {
      // Pass the 'note' from the component's state to the service function
      await markAttendance(subject._id, status, note);

      setIsMarked(true);
      setSuccessMessage(`Marked as ${status}`);
      onAttendanceUpdate(subject._id, status);
    } catch (err) {
      const message = err.response?.data?.message || "An error occurred.";
      setError(message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-slate-800">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{subject.name}</h2>
          <p className="text-slate-500 font-semibold mt-1">
            Attendance: {subject.attendedClasses} / {subject.totalClasses} (
            {percentage}%)
          </p>
        </div>
        <div className="flex gap-4 mt-4 sm:mt-0">
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
