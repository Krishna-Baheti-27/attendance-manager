import { useState } from "react";
import { motion } from "framer-motion";
import { createSubject } from "@/services/subjectService";

const AddSubjectForm = ({ onSubjectAdded }) => {
  const [name, setName] = useState("");
  const [initialAttended, setInitialAttended] = useState("");
  const [initialTotal, setInitialTotal] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Subject name cannot be empty.");
      return;
    }
    if (Number(initialAttended) > Number(initialTotal)) {
      setError("Attended classes cannot be greater than total classes.");
      return;
    }

    try {
      const newSubject = await createSubject(
        name,
        initialAttended,
        initialTotal
      );
      onSubjectAdded(newSubject);

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
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-8 p-6 bg-white rounded-2xl shadow-lg border border-slate-200"
    >
      <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-slate-800 flex items-center gap-2">
        📘 Add a New Subject
      </h2>

      <div className="flex flex-col gap-6">
        {/* Subject Name */}
        <div>
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
            className="w-full bg-slate-50 border border-slate-300 px-4 py-3 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition shadow-sm hover:shadow-md"
          />
        </div>

        {/* Initial Classes */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 min-w-[130px]">
            <label
              htmlFor="initialAttended"
              className="block text-sm font-medium text-slate-600 mb-1"
            >
              Classes Attended (Optional)
            </label>
            <input
              id="initialAttended"
              type="number"
              value={initialAttended}
              onChange={(e) => setInitialAttended(e.target.value)}
              placeholder="e.g., 9"
              min="0"
              className="w-full bg-slate-50 border border-slate-300 px-4 py-3 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition shadow-sm hover:shadow-md"
            />
          </div>

          <div className="flex-1 min-w-[130px]">
            <label
              htmlFor="initialTotal"
              className="block text-sm font-medium text-slate-600 mb-1"
            >
              Total Classes (Optional)
            </label>
            <input
              id="initialTotal"
              type="number"
              value={initialTotal}
              onChange={(e) => setInitialTotal(e.target.value)}
              placeholder="e.g., 10"
              min="0"
              className="w-full bg-slate-50 border border-slate-300 px-4 py-3 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition shadow-sm hover:shadow-md"
            />
          </div>
        </div>

        {/* Submit */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          className="bg-green-500 text-white font-semibold py-3 px-6 rounded-xl shadow hover:bg-green-600 transition max-w-xs mx-auto w-full"
        >
          ➕ Add Subject
        </motion.button>
      </div>

      {/* Error */}
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-500 mt-4 text-sm font-medium"
        >
          {error}
        </motion.p>
      )}
    </motion.form>
  );
};

export default AddSubjectForm;
