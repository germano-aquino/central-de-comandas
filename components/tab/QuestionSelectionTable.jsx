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

export function QuestionSelectionTable({ questions }) {
  const checkboxObject = questions.reduce((accumulator, question) => {
    accumulator[question.id] = false;
    return accumulator;
  }, {});

  const [checkboxOptions, setCheckboxOptions] = useState(checkboxObject);
  const [toggleAll, setToggleAll] = useState(true);

  function selectQuestion(question, option, checked) {
    setCheckboxOptions({ ...checkboxOptions, [option]: checked });
    // if (checked) question.options_marked.push(option);
    // else
    //   question.options_marked = question.options_marked.filter(
    //     (optionMarked) => optionMarked !== option,
    //   );
  }

  function handleCheckAllBoxes(questions) {
    const newCheckboxOptions = questions.reduce((accumulator, question) => {
      accumulator[question.id] = toggleAll;
      return accumulator;
    }, {});
    setCheckboxOptions(newCheckboxOptions);
    setToggleAll((state) => !state);
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
                checked={checkboxOptions[question.id]}
                onCheckedChange={(checked) =>
                  selectQuestion(question, question.id, checked)
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
