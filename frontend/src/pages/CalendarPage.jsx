// src/pages/CalendarPage.jsx
import { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { getCalendarEvents } from "@/services/calendarService";

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [currentView, setCurrentView] = useState("timeGridDay");
  const calendarRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => window.innerWidth < 768;
    setIsMobile(checkMobile());

    (async () => {
      try {
        const data = await getCalendarEvents();
        setEvents(data);
      } catch {
        setError(
          "Failed to load calendar events. Please ensure your Google account is connected."
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      const api = calendarRef.current?.getApi();
      if (!api) return;
      if (mobile && !["timeGridDay", "listDay"].includes(api.view.type)) {
        setCurrentView("timeGridDay");
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleViewChange = (view) => {
    setCurrentView(view);
    const api = calendarRef.current?.getApi();
    if (api) api.changeView(view);
  };

  if (loading)
    return <div className="text-center p-10">Loading Calendar...</div>;
  if (error)
    return <div className="text-center p-10 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* --- Mobile Header --- */}
      {isMobile && (
        <div className="sticky top-0 z-10 bg-white shadow-sm border-b">
          <div className="flex justify-around items-center">
            {[
              { label: "Day", view: "timeGridDay" },
              { label: "Agenda", view: "listDay" },
              { label: "Month", view: "dayGridMonth" },
            ].map(({ label, view }) => (
              <button
                key={view}
                onClick={() => handleViewChange(view)}
                className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                  currentView === view
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-600 border-transparent hover:text-blue-500"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* --- Calendar --- */}
      <div className={`${isMobile ? "px-0" : "p-4 max-w-6xl mx-auto"}`}>
        <FullCalendar
          ref={calendarRef}
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            listPlugin,
            interactionPlugin,
          ]}
          initialView={isMobile ? "timeGridDay" : "timeGridWeek"}
          headerToolbar={
            isMobile
              ? false
              : {
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
                }
          }
          height={isMobile ? "calc(100vh - 56px)" : "85vh"}
          events={events}
          nowIndicator
          editable={false}
          selectable
          dayMaxEvents={isMobile && currentView === "dayGridMonth" ? 2 : true}
          moreLinkClick="popover"
          popoverClassNames="z-50"
          eventTimeFormat={{
            hour: "numeric",
            minute: "2-digit",
            meridiem: "short",
          }}
          views={{
            timeGridDay: {
              titleFormat: { year: "numeric", month: "long", day: "numeric" },
              slotMinTime: "06:00:00",
              slotMaxTime: "22:00:00",
              allDaySlot: true,
            },
            timeGridWeek: {
              slotMinTime: "06:00:00",
              slotMaxTime: "22:00:00",
              allDaySlot: true,
              dayHeaderFormat: {
                weekday: "short",
                month: "numeric",
                day: "numeric",
              },
            },
            listDay: {
              type: "list",
              duration: { days: 1 },
              listDayFormat: { year: "numeric", month: "long", day: "numeric" },
            },
            listWeek: {
              listDayFormat: {
                weekday: "long",
                month: "short",
                day: "numeric",
              },
            },
            dayGridMonth: {
              dayMaxEventRows: isMobile ? 2 : 6,
            },
          }}
          eventContent={(arg) => {
            // Mobile month view gets special treatment
            if (isMobile && currentView === "dayGridMonth") {
              return (
                <div className="w-full px-1 py-0.5 text-xs truncate">
                  <div className="flex items-center gap-1">
                    {/* Status indicator dot */}
                    <div
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        arg.event.extendedProps.status === "present"
                          ? "bg-green-500"
                          : arg.event.extendedProps.status === "absent"
                          ? "bg-red-500"
                          : "bg-blue-500"
                      }`}
                    />
                    {/* Time if available */}
                    {arg.timeText && (
                      <span className="text-xs font-medium text-gray-600 flex-shrink-0">
                        {arg.timeText.replace(/:\d{2}/, "")}{" "}
                        {/* Remove minutes for space */}
                      </span>
                    )}
                    {/* Event title */}
                    <span className="text-xs font-medium text-gray-800 truncate">
                      {arg.event.title}
                    </span>
                  </div>
                </div>
              );
            }

            // Mobile agenda view
            if (isMobile && currentView === "listDay") {
              return (
                <div className="flex items-center gap-3 p-3">
                  {/* Time */}
                  {arg.timeText && (
                    <div className="flex-shrink-0 text-right w-16">
                      <div className="text-sm font-semibold text-gray-900">
                        {arg.timeText.split(" ")[0]}
                      </div>
                      <div className="text-xs text-gray-500">
                        {arg.timeText.split(" ")[1] || ""}
                      </div>
                    </div>
                  )}

                  {/* Status indicator bar */}
                  <div
                    className={`w-1 h-12 rounded-full flex-shrink-0 ${
                      arg.event.extendedProps.status === "present"
                        ? "bg-green-500"
                        : arg.event.extendedProps.status === "absent"
                        ? "bg-red-500"
                        : "bg-blue-500"
                    }`}
                  />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900 mb-1">
                      {arg.event.title}
                    </div>
                    {arg.event.extendedProps.status && (
                      <div className="text-xs text-gray-500 capitalize">
                        Status: {arg.event.extendedProps.status}
                      </div>
                    )}
                  </div>
                </div>
              );
            }

            // Mobile day view
            if (isMobile && currentView === "timeGridDay") {
              return (
                <div className="flex items-center gap-2 p-2">
                  {/* Status indicator */}
                  <div
                    className={`w-3 h-3 rounded-full flex-shrink-0 ${
                      arg.event.extendedProps.status === "present"
                        ? "bg-green-500"
                        : arg.event.extendedProps.status === "absent"
                        ? "bg-red-500"
                        : "bg-blue-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    {/* Time */}
                    {arg.timeText && (
                      <div className="text-xs font-medium text-gray-600 mb-1">
                        {arg.timeText}
                      </div>
                    )}
                    {/* Title */}
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {arg.event.title}
                    </div>
                  </div>
                </div>
              );
            }

            // Desktop views with proper background colors
            return (
              <div className="flex items-center space-x-2 p-1">
                {arg.timeText && (
                  <span className="text-xs font-medium text-white">
                    {arg.timeText}
                  </span>
                )}
                <span className="flex-1 text-xs font-medium text-white truncate">
                  {arg.event.title}
                </span>
              </div>
            );
          }}
          eventDidMount={(arg) => {
            // Mobile month view styling
            if (isMobile && currentView === "dayGridMonth") {
              arg.el.style.backgroundColor = "transparent";
              arg.el.style.border = "none";
              arg.el.style.margin = "1px 0";
              arg.el.style.padding = "0";
              arg.el.style.fontSize = "11px";
              arg.el.style.lineHeight = "1.2";
              arg.el.style.minHeight = "16px";
              arg.el.style.borderRadius = "3px";
              arg.el.style.backgroundColor = "#f8f9fa";
              arg.el.style.border = "1px solid #e9ecef";
            }

            // Mobile day view styling
            if (isMobile && currentView === "timeGridDay") {
              // Set background color based on status
              const status = arg.event.extendedProps.status;
              const bgColor =
                status === "present"
                  ? "#10b981"
                  : status === "absent"
                  ? "#ef4444"
                  : "#3b82f6";

              arg.el.style.backgroundColor = bgColor;
              arg.el.style.border = `1px solid ${bgColor}`;
              arg.el.style.borderRadius = "6px";
              arg.el.style.padding = "0";
              arg.el.style.margin = "1px 2px";
              arg.el.style.minHeight = "40px";
              arg.el.style.color = "white";
            }

            // Desktop view styling - restore background colors
            if (!isMobile) {
              const status = arg.event.extendedProps.status;
              const bgColor =
                status === "present"
                  ? "#10b981"
                  : status === "absent"
                  ? "#ef4444"
                  : "#3b82f6";

              arg.el.style.backgroundColor = bgColor;
              arg.el.style.borderColor = bgColor;
              arg.el.style.color = "white";
            }

            // Mobile list view styling
            if (isMobile && currentView === "listDay") {
              // Remove default FullCalendar styling
              arg.el.style.backgroundColor = "white";
              arg.el.style.border = "1px solid #e5e7eb";
              arg.el.style.borderRadius = "8px";
              arg.el.style.marginBottom = "8px";
              arg.el.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";

              // Hide default elements
              const timeEl = arg.el.querySelector(".fc-list-event-time");
              const titleEl = arg.el.querySelector(".fc-list-event-title");
              const dotEl = arg.el.querySelector(".fc-list-event-dot");

              if (timeEl) timeEl.style.display = "none";
              if (titleEl) {
                titleEl.style.padding = "0";
                titleEl.style.borderLeft = "none";
              }
              if (dotEl) dotEl.style.display = "none";
            }
          }}
          eventClick={(info) => setSelectedEvent(info.event)}
          // Custom CSS for mobile month view
          eventClassNames={(arg) => {
            if (isMobile && currentView === "dayGridMonth") {
              return ["mobile-month-event"];
            }
            return [];
          }}
        />
      </div>

      {/* --- Bottom Sheet (Mobile) --- */}
      {selectedEvent && isMobile && (
        <EventSheetMobile
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      {/* --- Modal (Desktop) --- */}
      {selectedEvent && !isMobile && (
        <EventModalDesktop
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      {/* --- Mobile Month View Custom Styles --- */}
      {isMobile && (
        <style jsx global>{`
          /* Mobile month view optimizations */
          .fc-dayGridMonth-view .fc-daygrid-day-events {
            margin: 2px !important;
          }

          .fc-dayGridMonth-view .fc-daygrid-event {
            margin: 1px 0 !important;
            padding: 2px !important;
            font-size: 10px !important;
            min-height: 18px !important;
            border-radius: 3px !important;
            background-color: #f8f9fa !important;
            border: 1px solid #e9ecef !important;
          }

          .fc-dayGridMonth-view .fc-daygrid-day-frame {
            min-height: 80px !important;
          }

          .fc-dayGridMonth-view .fc-daygrid-day-number {
            padding: 4px !important;
            font-size: 12px !important;
            font-weight: 600 !important;
          }

          .fc-dayGridMonth-view .fc-col-header-cell {
            padding: 8px 4px !important;
          }

          .fc-dayGridMonth-view .fc-col-header-cell-cushion {
            font-size: 11px !important;
            font-weight: 600 !important;
            text-transform: uppercase !important;
          }

          /* More link styling */
          .fc-dayGridMonth-view .fc-more-link {
            font-size: 10px !important;
            padding: 1px 4px !important;
            margin: 1px 0 !important;
            background-color: #6366f1 !important;
            color: white !important;
            border-radius: 2px !important;
            text-decoration: none !important;
          }

          /* Today highlighting */
          .fc-dayGridMonth-view .fc-day-today {
            background-color: #eff6ff !important;
          }

          .fc-dayGridMonth-view .fc-day-today .fc-daygrid-day-number {
            background-color: #3b82f6 !important;
            color: white !important;
            border-radius: 50% !important;
            width: 24px !important;
            height: 24px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }

          /* Mobile Day View Improvements */
          .fc-timeGridDay-view .fc-timegrid-slot {
            height: 50px !important;
          }

          .fc-timeGridDay-view .fc-timegrid-slot-label {
            font-size: 12px !important;
            padding: 4px !important;
          }

          .fc-timeGridDay-view .fc-event {
            border-radius: 6px !important;
            border: none !important;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
          }

          /* Mobile List View Improvements */
          .fc-listDay-view .fc-list-table {
            border: none !important;
          }

          .fc-listDay-view .fc-list-event {
            border: none !important;
            margin: 0 !important;
            border-radius: 0 !important;
            background: transparent !important;
            box-shadow: none !important;
          }

          .fc-listDay-view .fc-list-event-time,
          .fc-listDay-view .fc-list-event-title {
            padding: 0 !important;
            border: none !important;
          }

          .fc-listDay-view .fc-list-day-cushion {
            background: #f1f5f9 !important;
            padding: 12px 16px !important;
            font-size: 14px !important;
            font-weight: 600 !important;
            color: #374151 !important;
            border-bottom: 1px solid #e5e7eb !important;
            margin: 0 !important;
          }

          .fc-listDay-view .fc-list-empty {
            padding: 40px 20px !important;
            text-align: center !important;
            color: #9ca3af !important;
          }

          .fc-listDay-view {
            background: #f8fafc !important;
          }

          .fc-listDay-view .fc-scroller {
            background: #f8fafc !important;
          }
        `}</style>
      )}

      {/* Desktop Week View Improvements */}
      {!isMobile && (
        <style jsx global>{`
          /* Desktop week view optimizations */
          .fc-timeGridWeek-view .fc-col-header-cell {
            padding: 12px 4px !important;
            background: #f8fafc !important;
            border-bottom: 2px solid #e2e8f0 !important;
          }

          .fc-timeGridWeek-view .fc-col-header-cell-cushion {
            font-weight: 600 !important;
            font-size: 13px !important;
            color: #374151 !important;
          }

          .fc-timeGridWeek-view .fc-timegrid-slot {
            height: 40px !important;
          }

          .fc-timeGridWeek-view .fc-timegrid-slot-label {
            font-size: 11px !important;
            color: #6b7280 !important;
            padding: 6px !important;
          }

          .fc-timeGridWeek-view .fc-event {
            border-radius: 4px !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1) !important;
          }

          .fc-timeGridWeek-view .fc-timegrid-axis {
            border-right: 1px solid #e5e7eb !important;
          }

          .fc-timeGridWeek-view .fc-day-today {
            background-color: rgba(59, 130, 246, 0.05) !important;
          }

          .fc-timeGridWeek-view .fc-day-today .fc-col-header-cell-cushion {
            color: #3b82f6 !important;
            font-weight: 700 !important;
          }

          /* All day events in week view */
          .fc-timeGridWeek-view .fc-daygrid-event {
            margin: 1px !important;
            border-radius: 3px !important;
          }

          /* Popover z-index fix */
          .fc-popover {
            z-index: 1000 !important;
          }

          .fc-more-popover {
            z-index: 1000 !important;
          }

          .fc-popover .fc-popover-body {
            max-height: 200px !important;
            overflow-y: auto !important;
          }
        `}</style>
      )}
    </div>
  );
};

/* ---------- Mobile Bottom Sheet ---------- */
function EventSheetMobile({ event, onClose }) {
  return (
    <div
      className="fixed inset-0 z-20 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm max-h-[70vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">{event.title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        </div>
        <EventDetails event={event} />
      </div>
    </div>
  );
}

/* ---------- Desktop Modal ---------- */
function EventModalDesktop({ event, onClose }) {
  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/50">
      <div
        className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">{event.title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <EventDetails event={event} />
      </div>
    </div>
  );
}

/* ---------- Shared Event Details ---------- */
function EventDetails({ event }) {
  return (
    <div className="space-y-3 text-gray-700">
      <p className="text-sm">{formatEventTime(event)}</p>
      {event.extendedProps.status && (
        <span
          className={`px-2 py-1 rounded text-xs text-white ${
            event.extendedProps.status === "present"
              ? "bg-green-500"
              : event.extendedProps.status === "absent"
              ? "bg-red-500"
              : "bg-blue-500"
          }`}
        >
          {event.extendedProps.status.toUpperCase()}
        </span>
      )}
      {event.extendedProps.description && (
        <div>
          <p className="font-medium mb-1">Description</p>
          <p className="text-sm">{event.extendedProps.description}</p>
        </div>
      )}
    </div>
  );
}

/* ---------- Format Event Time ---------- */
function formatEventTime(event) {
  if (!event.start) return "";
  if (event.allDay) {
    return event.start.toLocaleDateString([], {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
  const timeOptions = { hour: "numeric", minute: "2-digit" };
  const dateOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  const startTime = event.start.toLocaleTimeString([], timeOptions);
  const endTime = event.end?.toLocaleTimeString([], timeOptions) || "";
  const date = event.start.toLocaleDateString([], dateOptions);
  return `${date} • ${startTime}${endTime ? ` - ${endTime}` : ""}`;
}

export default CalendarPage;
