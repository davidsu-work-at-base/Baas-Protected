import React from "react";
import { MapPin } from "lucide-react";
import { formatTime, groupEventsByDay } from "@/lib/calendarUtils";

export default function EventList({ events }) {
  const groups = groupEventsByDay(events);

  if (groups.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-14 text-center">
        <p className="text-slate-400">No events in the next 30 days.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <div key={group.key}>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {group.label}
          </p>
          <div className="mt-3 space-y-2">
            {group.events.map((event) => (
              <div
                key={event.id}
                className="flex gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm"
              >
                <div className="w-16 shrink-0 pt-0.5 text-sm text-slate-500">
                  {event.allDay ? "All day" : formatTime(event.startDate)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-slate-800 font-medium break-words">{event.summary}</p>
                  {event.location && (
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-400">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}