import { useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

export function YesOrNoQuestion({ question }) {
  const [, setOptions] = useState([]);

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
    </div>
  );
}
