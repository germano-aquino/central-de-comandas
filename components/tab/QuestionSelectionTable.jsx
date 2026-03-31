import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Checkbox } from "../ui/checkbox";
import { useState } from "react";
import { questionTypeLabels } from "@/pages/admin/perguntas";
import { Button } from "../ui/button";

export function QuestionSelectionTable({
  questions,
  questionIds,
  setQuestionIds,
}) {
  const [toggleAll, setToggleAll] = useState(true);

  const checkBoxObject = questions.reduce((accumulator, service) => {
    accumulator[service.id] = questionIds.includes(service.id);
    return accumulator;
  }, {});

  const [checkboxSelection, setCheckboxSelection] = useState(checkBoxObject);

  function handleSelectQuestion(questionId, checked) {
    setCheckboxSelection({
      ...checkboxSelection,
      [questionId]: checked,
    });
    if (checked) setQuestionIds((state) => [...state, questionId]);
    else
      questionIds = setQuestionIds((state) =>
        state.filter((id) => id !== questionId),
      );
    console.log("questionIds: ", questionIds);
  }

  function handleCheckAllBoxes() {
    const newSelected = questions.reduce((accumulator, service) => {
      accumulator[service.id] = toggleAll;
      return accumulator;
    }, {});

    setCheckboxSelection(newSelected);
    const toggleQuestionIds = questions.map((question) => question.id);
    if (toggleAll) questionIds.push(...toggleQuestionIds);
    else
      questionIds = questionIds.filter((id) => !toggleQuestionIds.includes(id));
    setToggleAll((state) => !state);
    console.log("questionIds: ", questionIds);
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-48">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleCheckAllBoxes(questions)}
            >
              Adicionar / Remover
            </Button>
          </TableHead>
          <TableHead>Pergunta</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead className="w-24">Ordem</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {questions.map((question) => (
          <TableRow key={question.id}>
            <TableCell className="w-42 flex items-center justify-center">
              <Checkbox
                className="cursor-pointer"
                id={question.id}
                checked={checkboxSelection[question.id]}
                onCheckedChange={(checked) =>
                  handleSelectQuestion(question.id, checked)
                }
              />
            </TableCell>
            <TableCell className="max-w-md">
              <div className="flex flex-col gap-1">
                <span>{question.statement}</span>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline">
                {questionTypeLabels[question.type]}
              </Badge>
            </TableCell>
            <TableCell>{question.order}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
