// src/components/ScheduleModal.jsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createSchedule } from "@/services/calendarService"; // 1. Import the new service

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
  const [isSubmitting, setIsSubmitting] = useState(false); // For loading state

  const handleDayChange = (dayId) => {
    setSelectedDays((prevDays) =>
      prevDays.includes(dayId)
        ? prevDays.filter((d) => d !== dayId)
        : [...prevDays, dayId]
    );
  };

  // 2. Update the handleSubmit function to be async and call the service
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
      // Call the API service
      await createSchedule(scheduleData);
      onClose(); // Close the modal on success
    } catch (err) {
      setError("Failed to create schedule. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false); // Reset loading state
    }
  };

  if (!isOpen || !subject) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Set Schedule for "{subject.name}"</DialogTitle>
          <DialogDescription>
            Create a recurring event in your Google Calendar for this subject.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Day selection checkboxes */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">Class Days</label>
            <div className="flex gap-2">
              {daysOfWeek.map((day) => (
                <button
                  key={day.id}
                  onClick={() => handleDayChange(day.id)}
                  className={`flex-1 p-2 border rounded-md text-center ${
                    selectedDays.includes(day.id)
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-slate-100 border-slate-300"
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>

          {/* Time inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="start-time" className="block font-medium mb-1">
                Start Time
              </label>
              <input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 p-2 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="end-time" className="block font-medium mb-1">
                End Time
              </label>
              <input
                id="end-time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 p-2 rounded-md"
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Schedule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleModal;
