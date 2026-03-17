import { useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

export function CheckboxQuestion({ question }) {
  const checkboxObject = question.options.reduce((accumulator, option) => {
    accumulator[option] = false;
    return accumulator;
  }, {});

  const [checkboxOptions, setCheckboxOptions] = useState(checkboxObject);

  function selectOption(question, option, checked) {
    setCheckboxOptions({ ...checkboxOptions, [option]: checked });
    if (checked) question.options_marked.push(option);
    else
      question.options_marked = question.options_marked.filter(
        (optionMarked) => optionMarked !== option,
      );
  }

  return (
    <div className="space-y-2">
      <Label>{question.statement}</Label>
      <div className="flex flex-col gap-2">
        {question.options.map((option) => {
          return (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={option}
                checked={checkboxOptions.option}
                onCheckedChange={(checked) =>
                  selectOption(question, option, checked)
                }
              />
              <Label htmlFor={option}>{option}</Label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
