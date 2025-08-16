// src/pages/DashboardPage.jsx
import { useContext, useEffect, useState } from "react";
import { getAllSubjects } from "@/services/subjectService";
import { AuthContext } from "@/context/AuthContext";
import SubjectCard from "@/components/SubjectCard";
import AddSubjectForm from "@/components/AddSubjectForm";

const DashboardPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token } = useContext(AuthContext);

  // Get today's date and format it for display
  const todaysDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    const fetchSubjects = async () => {
      if (!token) return;
      try {
        const data = await getAllSubjects(token);
        setSubjects(data);
      } catch (err) {
        setError("Failed to fetch subjects. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, [token]);

  // Adds a newly created subject to the UI without a refresh
  const handleSubjectAdded = (newSubject) => {
    setSubjects((prevSubjects) => [...prevSubjects, newSubject]);
  };

  // Updates the attendance stats in the UI instantly without a refresh
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

  if (loading) {
    return <div className="text-center p-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-slate-100 min-h-screen">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <AddSubjectForm onSubjectAdded={handleSubjectAdded} />

        <div className="my-8">
          <h1 className="text-3xl font-bold text-slate-800">Your Subjects</h1>
          {/* This h2 now correctly displays the date */}
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
    </div>
  );
};

export default DashboardPage;
