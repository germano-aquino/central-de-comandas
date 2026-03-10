import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

export function Question({ question }) {
  function selectOption(question, option) {
    question.option_marked = option;
  }

  if (question.type === "multiple-choice") {
    return (
      <div className="space-y-2">
        <Label>question.statement</Label>
        <div className="flex gap-4">
          {question.options.map((option) => {
            return (
              <Button
                key={option}
                type="button"
                size="sm"
                className={
                  option === question.option_marked
                    ? "bg-pink-600 hover:bg-pink-700"
                    : ""
                }
                onClick={() => selectOption(question, option)}
              >
                {option}
              </Button>
            );
          })}
        </div>
      </div>
    );
  } else if (question.type === "both") {
    return (
      <div className="space-y-2">
        <Label>question.statement</Label>
        <div className="flex gap-4">
          {question.options.map((option) => {
            return (
              <Button
                key={option}
                type="button"
                size="sm"
                className={
                  option === question.option_marked
                    ? "bg-pink-600 hover:bg-pink-700"
                    : ""
                }
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
            value={question.details}
            onChange={(e) =>
              updateDetails(questions, setQuestions, index, e.target.value)
            }
            className="mt-2"
          />
        )}
      </div>
    );
  } else if (question.type === "discursive") {
    return (
      <div className="space-y-2">
        <Label htmlFor="condicaoSaude">
          Alguma condição de saúde que ache importante mencionar?
        </Label>
        <Textarea
          id="condicaoSaude"
          placeholder="Descreva aqui..."
          value={condicaoSaude}
          onChange={(e) => setCondicaoSaude(e.target.value)}
          rows={3}
        />
      </div>
    );
  }
}
