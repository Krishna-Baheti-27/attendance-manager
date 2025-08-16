import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createSchedule } from "@/services/calendarService";

const daysOfWeek = [
  { id: "MO", label: "Mon" },
  { id: "TU", label: "Tue" },
  { id: "WE", label: "Wed" },
  { id: "TH", label: "Thu" },
  { id: "FR", label: "Fri" },
  { id: "SA", label: "Sat" },
  { id: "SU", label: "Sun" },
];

const ScheduleModal = ({ subject, isOpen, onClose }) => {
  const [selectedDays, setSelectedDays] = useState([]);
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("11:00");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDayChange = (dayId) => {
    setSelectedDays((prevDays) =>
      prevDays.includes(dayId)
        ? prevDays.filter((d) => d !== dayId)
        : [...prevDays, dayId]
    );
  };

  const handleSubmit = async () => {
    if (selectedDays.length === 0) {
      setError("Please select at least one day.");
      return;
    }
    setError("");
    setIsSubmitting(true);

    try {
      const scheduleData = {
        subjectId: subject?._id,
        days: selectedDays,
        startTime,
        endTime,
      };
      await createSchedule(scheduleData);
      onClose();
    } catch (err) {
      setError("Failed to create schedule. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !subject) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <DialogContent className="sm:max-w-[425px] bg-white rounded-2xl shadow-lg">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold">
                  Set Schedule for "{subject.name}"
                </DialogTitle>
                <DialogDescription className="text-slate-500">
                  Create a recurring event in your Google Calendar for this
                  subject.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-5 py-4">
                {/* Day selection */}
                <div>
                  <label className="block font-medium mb-2">Class Days</label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {daysOfWeek.map((day) => (
                      <motion.button
                        key={day.id}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDayChange(day.id)}
                        className={`p-2 rounded-full text-sm font-medium transition-all shadow-sm ${
                          selectedDays.includes(day.id)
                            ? "bg-green-500 text-white shadow-md"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {day.label}
                      </motion.button>
                    ))}
                  </div>
                </div>
                {/* Time inputs */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="start-time"
                      className="block font-medium mb-1"
                    >
                      Start Time
                    </label>
                    <input
                      id="start-time"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="end-time"
                      className="block font-medium mb-1"
                    >
                      End Time
                    </label>
                    <input
                      id="end-time"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm"
                  >
                    {error}
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  {isSubmitting ? "Saving..." : "Save Schedule"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Dialog>
  );
};

export default ScheduleModal;
