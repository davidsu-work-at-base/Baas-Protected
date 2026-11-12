import React, { useCallback, useEffect, useRef, useState } from "react";
import { base44 } from "@/api/base44Client";
import { CALENDAR_CONNECTOR_ID } from "@/lib/calendarConfig";
import { navigateTo } from "@/lib/navigation";
import ConnectCard from "@/components/calendar/ConnectCard";
import EventList from "@/components/calendar/EventList";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogIn, RefreshCw, Unplug } from "lucide-react";

export default function CalendarPage() {
  const [status, setStatus] = useState("loading");
  const [connected, setConnected] = useState(false);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const popupTimer = useRef(null);

  const loadEvents = useCallback(async () => {
    try {
      const response = await base44.functions.invoke("getCalendarEvents", {});
      const data = response.data || {};
      setConnected(Boolean(data.connected));
      setEvents(data.events || []);
      setError(data.error || "");
    } catch (err) {
      setConnected(false);
      setEvents([]);
      setError("");
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const authed = await base44.auth.isAuthenticated();
        if (!active) return;
        if (authed) {
          setStatus("ready");
          await loadEvents();
        } else {
          setStatus("anonymous");
        }
      } catch (err) {
        if (active) setStatus("anonymous");
      }
    })();
    return () => {
      active = false;
      if (popupTimer.current) clearInterval(popupTimer.current);
    };
  }, [loadEvents]);

  const handleConnect = async () => {
    setError("");
    setConnecting(true);
    try {
      const url = await base44.connectors.connectAppUser(CALENDAR_CONNECTOR_ID);
      const popup = window.open(url, "_blank", "width=520,height=680");
      if (popupTimer.current) clearInterval(popupTimer.current);
      popupTimer.current = setInterval(() => {
        if (!popup || popup.closed) {
          clearInterval(popupTimer.current);
          popupTimer.current = null;
          loadEvents();
        }
      }, 800);
    } catch (err) {
      setError("Could not start the Google sign-in. Please try again.");
    } finally {
      setConnecting(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadEvents();
    setRefreshing(false);
  };

  const handleDisconnect = async () => {
    try {
      await base44.connectors.disconnectAppUser(CALENDAR_CONNECTOR_ID);
    } finally {
      setConnected(false);
      setEvents([]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50/30">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <button
          onClick={() => navigateTo("/")}
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Tasks
        </button>

        <div className="mt-6 mb-10 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Your calendar</h1>
            <p className="text-slate-500 mt-1 text-sm">Next 30 days from your Google Calendar</p>
          </div>
          {status === "ready" && connected && (
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRefresh}
                disabled={refreshing}
                className="h-9 w-9 text-slate-400 hover:text-slate-700"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDisconnect}
                className="h-9 w-9 text-slate-400 hover:text-red-500"
              >
                <Unplug className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {status === "loading" && (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-slate-200 border-t-orange-500 rounded-full animate-spin" />
          </div>
        )}

        {status === "anonymous" && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
            <h2 className="text-lg font-medium text-slate-900">Sign in to see your calendar</h2>
            <p className="mt-2 text-sm text-slate-500">
              Your calendar is private, so you need to be signed in to view it.
            </p>
            <Button
              onClick={() => base44.auth.redirectToLogin(window.location.href)}
              className="mt-6 h-11 px-5 rounded-xl bg-slate-900 hover:bg-slate-800"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign in
            </Button>
          </div>
        )}

        {status === "ready" && !connected && (
          <ConnectCard onConnect={handleConnect} busy={connecting} error={error} />
        )}

        {status === "ready" && connected && (
          <>
            {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
            <EventList events={events} />
          </>
        )}
      </div>
    </div>
  );
}