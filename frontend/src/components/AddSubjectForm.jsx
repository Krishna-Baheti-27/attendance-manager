// src/components/AddSubjectForm.jsx
import { useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { createSubject } from "@/services/subjectService";

const AddSubjectForm = ({ onSubjectAdded }) => {
  const [name, setName] = useState("");
  // State for the new initial attendance fields
  const [initialAttended, setInitialAttended] = useState("");
  const [initialTotal, setInitialTotal] = useState("");

  const [error, setError] = useState("");
  const { token } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Subject name cannot be empty.");
      return;
    }
    // Basic validation for the numbers
    if (Number(initialAttended) > Number(initialTotal)) {
      setError("Attended classes cannot be greater than total classes.");
      return;
    }

    try {
      // Pass the new values to the service function
      const newSubject = await createSubject(
        name,
        token,
        initialAttended,
        initialTotal
      );
      onSubjectAdded(newSubject);

      // Reset all form fields
      setName("");
      setInitialAttended("");
      setInitialTotal("");
      setError("");
    } catch (err) {
      setError("Failed to create subject. Please try again.");
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 p-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold mb-4 text-slate-800">
        Add a New Subject
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Subject Name Input */}
        <div className="md:col-span-3">
          <label
            htmlFor="subjectName"
            className="block text-sm font-medium text-slate-600 mb-1"
          >
            Subject Name
          </label>
          <input
            id="subjectName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Advanced Algorithms"
            className="w-full bg-slate-50 border border-slate-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Initial Attended Input */}
        <div>
          <label
            htmlFor="initialAttended"
            className="block text-sm font-medium text-slate-600 mb-1"
          >
            Initial Classes Attended (Optional)
          </label>
          <input
            id="initialAttended"
            type="number"
            value={initialAttended}
            onChange={(e) => setInitialAttended(e.target.value)}
            placeholder="e.g., 9"
            min="0"
            className="w-full bg-slate-50 border border-slate-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Initial Total Input */}
        <div>
          <label
            htmlFor="initialTotal"
            className="block text-sm font-medium text-slate-600 mb-1"
          >
            Initial Total Classes (Optional)
          </label>
          <input
            id="initialTotal"
            type="number"
            value={initialTotal}
            onChange={(e) => setInitialTotal(e.target.value)}
            placeholder="e.g., 10"
            min="0"
            className="w-full bg-slate-50 border border-slate-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Submit Button */}
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
          >
            Add Subject
          </button>
        </div>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
};

export default AddSubjectForm;
