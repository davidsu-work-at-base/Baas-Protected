import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AskAssistant() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const ask = async () => {
    const reply = await base44.integrations.Core.InvokeLLM({ prompt: question });
    setAnswer(reply);
  };

  return (
    <div className="flex flex-col gap-2">
      <Input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ask the assistant" />
      <Button onClick={ask}>Ask</Button>
      <p>{answer}</p>
    </div>
  );
}
