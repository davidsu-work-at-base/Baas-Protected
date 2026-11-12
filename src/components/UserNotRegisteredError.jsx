import React from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";

export default function UserNotRegisteredError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
        <h1 className="text-lg font-medium text-slate-900">Access not granted</h1>
        <p className="mt-2 text-sm text-slate-500">
          Your account is signed in, but it has no access to this app yet. Ask an administrator to
          invite you, then sign in again.
        </p>
        <Button
          onClick={() => base44.auth.logout()}
          className="mt-6 h-11 px-5 rounded-xl bg-slate-900 hover:bg-slate-800"
        >
          Sign out
        </Button>
      </div>
    </div>
  );
}