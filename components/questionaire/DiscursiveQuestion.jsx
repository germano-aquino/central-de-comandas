import { useState } from "react";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

export function DiscursiveQuestion({ question }) {
  const [answer, setAnswer] = useState(question.answer);

  function selectAnswer(question, answer) {
    setAnswer(answer);
    question.answer = answer;
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="discursiveQuestion">{question.statement}</Label>
      <Textarea
        id="discursiveQuestion"
        placeholder="Descreva aqui..."
        value={answer}
        onChange={(e) => selectAnswer(question, e.target.value)}
        rows={3}
      />
    </div>
  );
}
