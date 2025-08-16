// src/pages/CalendarPage.jsx
import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { getCalendarEvents } from "@/services/calendarService";

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getCalendarEvents(); // [{ id,title,start,end,description,status,note }]
        setEvents(data);
      } catch {
        setError(
          "Failed to load calendar events. Please ensure your Google account is connected."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading)
    return <div className="text-center p-10">Loading Calendar...</div>;
  if (error)
    return <div className="text-center p-10 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto bg-white/90 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-2xl p-6">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          height="85vh"
          events={events}
          editable={false}
          selectable={true}
          dayMaxEvents={true}
          // Keep blocks minimal (time + title only)
          eventContent={(arg) => {
            return (
              <div className="px-2 py-1 text-xs font-medium text-white truncate">
                {arg.timeText && (
                  <span className="mr-1 font-semibold">{arg.timeText}</span>
                )}
                <span>{arg.event.title}</span>
              </div>
            );
          }}
          // Color events by status
          eventDidMount={(arg) => {
            const status = arg.event.extendedProps.status;
            const el = arg.el;
            // Default FullCalendar event has its own background; override it
            let bg = "linear-gradient(to right, #3b82f6, #6366f1)"; // blue
            if (status === "present")
              bg = "linear-gradient(to right, #22c55e, #10b981)"; // green
            if (status === "absent")
              bg = "linear-gradient(to right, #ef4444, #f43f5e)"; // red

            el.style.backgroundImage = bg;
            el.style.border = "none";
            el.style.color = "white";
            el.style.borderRadius = "8px";
            el.style.boxShadow = "0 2px 6px rgba(0,0,0,0.15)";
          }}
          // Open modal with details
          eventClick={(info) => setSelectedEvent(info.event)}
        />
      </div>

      {/* Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-bold">{selectedEvent.title}</h2>
              <button
                onClick={() => setSelectedEvent(null)}
                className="rounded-lg px-3 py-1 bg-gray-100 hover:bg-gray-200"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 text-sm">
              {/* Time range */}
              <div className="text-gray-700">
                {formatEventTime(selectedEvent)}
              </div>

              {/* Status badge */}
              {selectedEvent.extendedProps.status && (
                <div>
                  <span className="text-gray-600 mr-2">Status:</span>
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      selectedEvent.extendedProps.status === "present"
                        ? "bg-green-600"
                        : selectedEvent.extendedProps.status === "absent"
                        ? "bg-red-600"
                        : "bg-indigo-600"
                    }`}
                  >
                    {selectedEvent.extendedProps.status.toUpperCase()}
                  </span>
                </div>
              )}

              {/* Note (from metadata or parsed) */}
              {selectedEvent.extendedProps.note && (
                <div className="text-gray-700">
                  <span className="font-medium">Note:</span>{" "}
                  {selectedEvent.extendedProps.note}
                </div>
              )}

              {/* Original description */}
              {selectedEvent.extendedProps.description && (
                <div className="text-gray-600">
                  <span className="font-medium">Description:</span>{" "}
                  {selectedEvent.extendedProps.description}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper to format event time nicely in the modal
function formatEventTime(event) {
  const start = event.start;
  const end = event.end;
  if (!start) return "";
  const opts = { hour: "numeric", minute: "2-digit" };
  if (
    event.allDay ||
    (!event.startStr?.includes("T") && !event.endStr?.includes("T"))
  ) {
    return start.toDateString();
  }
  const s = start.toLocaleTimeString([], opts);
  const e = end ? end.toLocaleTimeString([], opts) : "";
  const day = start.toLocaleDateString([], {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return `${day} • ${s}${e ? ` – ${e}` : ""}`;
}

export default CalendarPage;
