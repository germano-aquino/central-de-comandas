import { useState } from "react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

export function Question({ question }) {
  const optionsObject = question.options.reduce((accumulator, option) => {
    accumulator[option] = false;
    return accumulator;
  }, {});

  const [options, setOptions] = useState(optionsObject);
  const [answer, setAnswer] = useState(question.answer);

  function selectOption(question, option, checked) {
    setOptions({ ...options, [option]: checked });
    if (checked || question.type === "both") question.option_marked = option;
  }

  function selectAnswer(question, newAnswer) {
    setAnswer(newAnswer);
    question.answer = answer;
  }

  function getButtonVariant(question, option) {
    const isSelected = question.option_marked === option;
    return isSelected ? "default" : "outline";
  }

  function getButtonClassname(question, option) {
    const isSelected = question.option_marked === option;
    return isSelected ? "bg-pink-600 hover:bg-pink-700" : "";
  }

  switch (question.type) {
    case "multiple-choice":
      return (
        <div className="space-y-2">
          <Label>{question.statement}</Label>
          <div className="flex flex-col gap-2">
            {question.options.map((option) => {
              return (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={option}
                    checked={options.option}
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

    case "both":
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
          {question.option_marked === "Sim" && (
            <Input
              placeholder="Descreva os detalhes"
              value={answer}
              onChange={(e) => selectAnswer(question, e.target.value)}
              className="mt-2"
            />
          )}
        </div>
      );
    case "discursive":
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
    default:
      return <></>;
  }
}
