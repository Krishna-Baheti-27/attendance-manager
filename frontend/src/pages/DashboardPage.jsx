// src/pages/DashboardPage.jsx
import { useContext, useEffect, useState } from "react";
import { getAllSubjects, createSubject } from "@/services/subjectService"; // Import createSubject
import { AuthContext } from "@/context/AuthContext";
import SubjectCard from "@/components/SubjectCard";

// New component for adding subjects
const AddSubjectForm = ({ onSubjectAdded }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const { token } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Subject name cannot be empty.");
      return;
    }
    try {
      const newSubject = await createSubject(name, token);
      onSubjectAdded(newSubject); // Pass the new subject up to the parent
      setName(""); // Clear the input field
      setError("");
    } catch (err) {
      setError("Failed to create subject.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 p-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold mb-4">Add a New Subject</h2>
      <div className="flex gap-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Computer Networks"
          className="flex-1 bg-slate-50 border border-slate-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-green-500 text-white font-bold py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
        >
          Add Subject
        </button>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
};

const DashboardPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchSubjects = async () => {
      if (!token) return;
      try {
        const data = await getAllSubjects(token);
        setSubjects(data);
      } catch (err) {
        setError("Failed to fetch subjects.");
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, [token]);

  // This function adds the new subject to the list without a refresh
  const handleSubjectAdded = (newSubject) => {
    setSubjects((prevSubjects) => [...prevSubjects, newSubject]);
  };

  if (loading) return <div className="text-center p-10">Loading...</div>;
  if (error)
    return <div className="text-center p-10 text-red-500">{error}</div>;

  return (
    <div className="bg-slate-100 min-h-screen">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        {/* Add the new form here */}
        <AddSubjectForm onSubjectAdded={handleSubjectAdded} />

        <h1 className="text-3xl font-bold mb-6">Your Subjects</h1>
        {subjects.length > 0 ? (
          <div className="flex flex-col gap-6">
            {subjects.map((subject) => (
              // Pass the 'todaysStatus' prop to the card
              <SubjectCard
                key={subject._id}
                subject={subject}
                todaysStatus={subject.todaysStatus} // This fixes the refresh issue
              />
            ))}
          </div>
        ) : (
          <p className="text-slate-500">You haven't added any subjects yet.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
