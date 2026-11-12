import React, { useEffect, useState } from "react";
import { AuthProvider } from "@/lib/AuthContext";
import TasksPage from "@/pages/TasksPage";
import CalendarPage from "@/pages/CalendarPage";
import { currentPath } from "@/lib/navigation";

function AppRoutes() {
  const [path, setPath] = useState(currentPath);

  useEffect(() => {
    const sync = () => setPath(currentPath());
    window.addEventListener("popstate", sync);
    window.addEventListener("app:navigate", sync);
    const timer = setInterval(() => setPath(currentPath()), 250);
    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener("app:navigate", sync);
      clearInterval(timer);
    };
  }, []);

  if (path === "/calendar") {
    return <CalendarPage />;
  }

  return <TasksPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}