// src/pages/DashboardPage.jsx
import { useContext, useEffect, useState } from "react";
import { getAllSubjects } from "@/services/subjectService";
import { AuthContext } from "@/context/AuthContext";
import SubjectCard from "@/components/SubjectCard";
import AddSubjectForm from "@/components/AddSubjectForm";
import ScheduleModal from "@/components/ScheduleModal";

const DashboardPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --- THIS IS THE FIX ---
  // We need to get the 'user' object from the context to check for googleId
  const { user } = useContext(AuthContext);
  // --- END OF FIX ---

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const todaysDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await getAllSubjects();
        setSubjects(data);
      } catch (err) {
        setError("Failed to fetch subjects.");
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  const handleSubjectAdded = (newSubject) => {
    setSubjects((prevSubjects) => [...prevSubjects, newSubject]);
    setSelectedSubject(newSubject);
    setIsModalOpen(true);
  };

  const handleAttendanceUpdate = (subjectId, status) => {
    setSubjects((prevSubjects) =>
      prevSubjects.map((subject) => {
        if (subject._id === subjectId) {
          const updatedSubject = { ...subject };
          updatedSubject.totalClasses += 1;
          if (status === "present") {
            updatedSubject.attendedClasses += 1;
          }
          updatedSubject.todaysStatus = status;
          return updatedSubject;
        }
        return subject;
      })
    );
  };

  if (loading) return <div className="text-center p-10">Loading...</div>;
  if (error)
    return <div className="text-center p-10 text-red-500">{error}</div>;

  return (
    <div className="bg-slate-100 min-h-screen">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        {/* Conditionally render based on whether user.googleId exists */}
        {user && !user.googleId ? (
          <div className="p-6 bg-white rounded-lg shadow-md mb-8 text-center">
            <h2 className="text-2xl font-bold mb-2 text-slate-800">
              Sync with Google Calendar
            </h2>
            <p className="text-slate-500 mb-4">
              Connect your account to automatically create a timetable.
            </p>
            <a
              href="http://localhost:3000/api/v1/auth/google"
              className="inline-block bg-blue-500 text-white font-bold py-2 px-6 rounded-md hover:bg-blue-600"
            >
              Connect Google Calendar
            </a>
          </div>
        ) : (
          <div className="p-6 bg-green-100 border border-green-300 text-green-800 rounded-lg shadow-md mb-8 text-center">
            <h2 className="text-2xl font-bold">
              ✅ Google Calendar Connected!
            </h2>
          </div>
        )}

        <AddSubjectForm onSubjectAdded={handleSubjectAdded} />

        <div className="my-8">
          <h1 className="text-3xl font-bold text-slate-800">Your Subjects</h1>
          <h2 className="text-xl text-slate-500 mt-1">{todaysDate}</h2>
        </div>

        {subjects.length > 0 ? (
          <div className="flex flex-col gap-6">
            {subjects.map((subject) => (
              <SubjectCard
                key={subject._id}
                subject={subject}
                todaysStatus={subject.todaysStatus}
                onAttendanceUpdate={handleAttendanceUpdate}
              />
            ))}
          </div>
        ) : (
          <p className="text-slate-500">You haven't added any subjects yet.</p>
        )}
      </div>

      <ScheduleModal
        subject={selectedSubject}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default DashboardPage;
