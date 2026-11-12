import React from "react";
import { Button } from "@/components/ui/button";
import { CalendarDays, Loader2, ShieldCheck } from "lucide-react";

export default function ConnectCard({ onConnect, busy, error }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
      <div className="mx-auto w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
        <CalendarDays className="w-6 h-6" />
      </div>
      <h2 className="mt-4 text-lg font-medium text-slate-900">Connect your Google Calendar</h2>
      <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">
        Your calendar stays private to you. Connect your Google account to see your next 30 days of
        events here.
      </p>
      <Button
        onClick={onConnect}
        disabled={busy}
        className="mt-6 h-11 px-5 rounded-xl bg-slate-900 hover:bg-slate-800"
      >
        {busy ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Opening Google…
          </span>
        ) : (
          "Connect Google Calendar"
        )}
      </Button>
      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
      <p className="mt-6 inline-flex items-center gap-1.5 text-xs text-slate-400">
        <ShieldCheck className="w-3.5 h-3.5" />
        Read-only access
      </p>
    </div>
  );
}