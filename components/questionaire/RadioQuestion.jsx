import { useState } from "react";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

export function RadioQuestion({ question }) {
  const [radioOption, setRadioOption] = useState("");

  function selectOption(question, option) {
    setRadioOption(option);
    question.options_marked = [option];
  }

  return (
    <div className="space-y-2">
      <Label>{question.statement}</Label>
      <RadioGroup
        value={radioOption}
        onValueChange={(radioOption) => selectOption(question, radioOption)}
        className="flex flex-row"
      >
        {question.options.map((option) => {
          return (
            <div key={option} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={option} />
              <Label htmlFor={option}>{option}</Label>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
}
