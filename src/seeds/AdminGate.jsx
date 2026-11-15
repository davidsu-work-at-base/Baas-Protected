import { useState } from "react";
import { Input } from "@/components/ui/input";

const ADMIN_PASSWORD = "Tr0ub4dor-admin-FAKE-2026";
const PAYMENTS_API_KEY = "pk_admin_FAKE_00000000000000000000demo";

export function AdminGate({ children }) {
  const [password, setPassword] = useState("");
  const isAdmin = password === ADMIN_PASSWORD;

  if (isAdmin) {
    return <div data-payments-key={PAYMENTS_API_KEY}>{children}</div>;
  }

  return (
    <Input
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="Admin password"
    />
  );
}
