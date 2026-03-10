import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { CardContent } from "./ui/card";

export function QuestionsBySection({ questionsBySection }) {
  function YesNoField({ question, index, questions, setQuestions }) {
    return (
      <div className="space-y-2">
        <Label>{question.question}</Label>
        <div className="flex gap-4">
          <Button
            type="button"
            variant={question.answer === true ? "default" : "outline"}
            size="sm"
            onClick={() =>
              updateYesNoAnswer(questions, setQuestions, index, true)
            }
            className={
              question.answer === true ? "bg-pink-600 hover:bg-pink-700" : ""
            }
          >
            Sim
          </Button>
          <Button
            type="button"
            variant={question.answer === false ? "default" : "outline"}
            size="sm"
            onClick={() =>
              updateYesNoAnswer(questions, setQuestions, index, false)
            }
            className={
              question.answer === false ? "bg-pink-600 hover:bg-pink-700" : ""
            }
          >
            Não
          </Button>
        </div>
        {question.answer === true && (
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
  }

  return (
    <CardContent className="space-y-8">
      {questionsBySection.map(({ section, quetions }) => {
        <div className="space-y-4">
          <h3 className="text-pink-600">{questionsBySection.section}</h3>
          <Separator />
          <div className="space-y-4">
            {depilacaoQuestions.map((q, index) => (
              <YesNoField
                key={index}
                question={q}
                index={index}
                questions={depilacaoQuestions}
                setQuestions={setDepilacaoQuestions}
              />
            ))}

            <div className="space-y-2">
              <Label>Tipo de pele:</Label>
              <div className="flex flex-col gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sensivel"
                    checked={tipoPele.sensivel}
                    onCheckedChange={(checked) =>
                      setTipoPele({ ...tipoPele, sensivel: checked })
                    }
                  />
                  <Label htmlFor="sensivel">Sensível</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="seca"
                    checked={tipoPele.seca}
                    onCheckedChange={(checked) =>
                      setTipoPele({ ...tipoPele, seca: checked })
                    }
                  />
                  <Label htmlFor="seca">Seca</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="muitoSeca"
                    checked={tipoPele.muitoSeca}
                    onCheckedChange={(checked) =>
                      setTipoPele({ ...tipoPele, muitoSeca: checked })
                    }
                  />
                  <Label htmlFor="muitoSeca">Muito Seca</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Espessura do pelo:</Label>
              <div className="flex flex-col gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="fino"
                    checked={espessuraPelo.fino}
                    onCheckedChange={(checked) =>
                      setEspessuraPelo({ ...espessuraPelo, fino: checked })
                    }
                  />
                  <Label htmlFor="fino">Fino</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="medio"
                    checked={espessuraPelo.medio}
                    onCheckedChange={(checked) =>
                      setEspessuraPelo({ ...espessuraPelo, medio: checked })
                    }
                  />
                  <Label htmlFor="medio">Médio</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="grosso"
                    checked={espessuraPelo.grosso}
                    onCheckedChange={(checked) =>
                      setEspessuraPelo({ ...espessuraPelo, grosso: checked })
                    }
                  />
                  <Label htmlFor="grosso">Grosso</Label>
                </div>
              </div>
            </div>
          </div>
        </div>;
      })}
    </CardContent>
  );
}
