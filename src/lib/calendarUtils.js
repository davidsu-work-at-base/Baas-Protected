export function parseEventDate(value, allDay) {
  if (!value) return null;
  if (allDay) {
    const parts = value.split("-").map(Number);
    if (parts.length === 3 && parts.every((n) => !Number.isNaN(n))) {
      return new Date(parts[0], parts[1] - 1, parts[2]);
    }
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function dayKey(date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export function dayLabel(date) {
  const today = new Date();
  const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  if (dayKey(date) === dayKey(today)) return "Today";
  if (dayKey(date) === dayKey(tomorrow)) return "Tomorrow";
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

export function formatTime(date) {
  if (!date) return "";
  return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

export function groupEventsByDay(events) {
  const groups = [];
  const index = new Map();

  for (const event of events) {
    const start = parseEventDate(event.start, event.allDay);
    const key = start ? dayKey(start) : "unknown";
    if (!index.has(key)) {
      const group = {
        key,
        label: start ? dayLabel(start) : "Someday",
        events: [],
      };
      index.set(key, group);
      groups.push(group);
    }
    index.get(key).events.push({ ...event, startDate: start });
  }

  return groups;
}