import { useState } from "react";
import { motion } from "framer-motion";
import { markAttendance } from "@/services/attendanceService";

function SubjectCard({ subject, todaysStatus, onAttendanceUpdate }) {
  const [isMarked, setIsMarked] = useState(!!todaysStatus);
  const [note, setNote] = useState("");
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
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white p-6 rounded-2xl shadow-md border border-slate-200 text-slate-800 transition"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold">{subject.name}</h2>
          <p className="text-slate-500 font-medium mt-1 text-sm sm:text-base">
            Attendance:{" "}
            <span className="font-semibold text-slate-700">
              {subject.attendedClasses} / {subject.totalClasses}
            </span>
            <span
              className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
                percentage >= 75
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {percentage}%
            </span>
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 w-full sm:w-auto">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handleMarkAttendance("present")}
            disabled={isMarked}
            className="flex-1 sm:flex-none bg-green-500 text-white font-semibold py-2 px-4 rounded-xl shadow hover:bg-green-600 transition disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            Present ✔️
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handleMarkAttendance("absent")}
            disabled={isMarked}
            className="flex-1 sm:flex-none bg-red-500 text-white font-semibold py-2 px-4 rounded-xl shadow hover:bg-red-600 transition disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            Absent ❌
          </motion.button>
        </div>
      </div>

      {/* Notes & Status */}
      <div className="mt-4">
        {isMarked ? (
          <p
            className={`font-semibold text-sm sm:text-base ${
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
              className="w-full bg-slate-50 border border-slate-300 p-3 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm hover:shadow-md"
              placeholder="e.g., Guest lecture today"
            />
          </div>
        )}

        {error && (
          <p className="text-red-500 mt-2 text-sm font-medium">{error}</p>
        )}
      </div>
    </motion.div>
  );
}

export default SubjectCard;
