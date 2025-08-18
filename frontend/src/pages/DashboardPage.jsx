import { useContext, useEffect, useState } from "react";
import { getAllSubjects } from "@/services/subjectService";
import { AuthContext } from "@/context/AuthContext";
import SubjectCard from "@/components/SubjectCard";
import AddSubjectForm from "@/components/AddSubjectForm";
import ScheduleModal from "@/components/ScheduleModal";
import { motion, AnimatePresence } from "framer-motion";

const DashboardPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);

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

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-slate-600 text-lg">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-red-500 font-medium">
        {error}
      </div>
    );

  const backendUrl = import.meta.env.VITE_API_URL;

  return (
    <div className="bg-slate-100 min-h-screen">
      <div className="container mx-auto p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          {user && !user.googleId ? (
            <div className="p-6 bg-white rounded-xl shadow-md text-center">
              <h2 className="text-2xl font-bold mb-2 text-slate-800">
                Sync with Google Calendar
              </h2>
              <p className="text-slate-500 mb-4">
                Connect your account to automatically create a timetable.
              </p>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={`${backendUrl}/api/v1/auth/google`}
                className="inline-block bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg shadow hover:bg-blue-600 transition-colors"
              >
                Connect Google Calendar
              </motion.a>
            </div>
          ) : (
            <div className="p-6 bg-green-100 border border-green-300 text-green-800 rounded-xl shadow-md text-center">
              <motion.h2
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="text-2xl font-bold"
              >
                ✅ Google Calendar Connected!
              </motion.h2>
            </div>
          )}
        </motion.div>

        {/* Add Subject Form */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <AddSubjectForm onSubjectAdded={handleSubjectAdded} />
        </motion.div>

        {/* Section Heading */}
        <div className="my-8 text-center sm:text-left">
          <h1 className="text-3xl font-bold text-slate-800">Your Subjects</h1>
          <h2 className="text-lg text-slate-500 mt-1">{todaysDate}</h2>
        </div>

        {/* Subject List */}
        <AnimatePresence>
          {subjects.length > 0 ? (
            <div className="flex flex-col gap-6">
              {subjects.map((subject, idx) => (
                <motion.div
                  key={subject._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <SubjectCard
                    subject={subject}
                    todaysStatus={subject.todaysStatus}
                    onAttendanceUpdate={handleAttendanceUpdate}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-slate-500 text-center sm:text-left"
            >
              You haven’t added any subjects yet.
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Schedule Modal */}
      <ScheduleModal
        subject={selectedSubject}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default DashboardPage;
