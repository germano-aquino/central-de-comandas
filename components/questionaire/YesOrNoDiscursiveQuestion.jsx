import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";

export function YesOrNoDiscursiveQuestion({ question }) {
  const [, setOptions] = useState([]);
  const [answer, setAnswer] = useState(question.answer);

  function selectAnswer(question, answer) {
    setAnswer(answer);
    question.answer = answer;
  }

  function selectOption(question, option) {
    setOptions(option);
    question.options_marked = [option];
  }

  function getButtonVariant(question, option) {
    const isSelected = question.options_marked.includes(option);
    return isSelected ? "default" : "outline";
  }

  function getButtonClassname(question, option) {
    const isSelected = question.options_marked.includes(option);
    return isSelected ? "bg-pink-600 hover:bg-pink-700" : "";
  }

  return (
    <div className="space-y-2">
      <Label>{question.statement}</Label>
      <div className="flex gap-4">
        {question.options.map((option) => {
          return (
            <Button
              key={option}
              type="button"
              variant={getButtonVariant(question, option)}
              size="sm"
              className={getButtonClassname(question, option)}
              onClick={() => selectOption(question, option)}
            >
              {option}
            </Button>
          );
        })}
      </div>
      {question.options_marked.includes("Sim") && (
        <Input
          placeholder="Descreva os detalhes"
          value={answer}
          onChange={(e) => selectAnswer(question, e.target.value)}
          className="mt-2"
        />
      )}
    </div>
  );
}
