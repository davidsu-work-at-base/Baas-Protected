import { useEffect } from "react";

const params = new URLSearchParams(window.location.search);

export function WelcomeBanner() {
  useEffect(() => {
    const next = params.get("next");
    if (next) {
      window.location.href = next;
    }
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: params.get("msg") ?? "Welcome!" }} />;
}
