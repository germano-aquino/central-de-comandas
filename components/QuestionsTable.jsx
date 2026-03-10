import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "./ui/button";

import { questionTypeLabels } from "@/pages/admin/perguntas";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export function QuestionsTable({
  questions,
  setQuestions,
  sections,
  filterSection,
  handleOpenDialog,
}) {
  async function deleteQuestion(id) {
    try {
      await fetch(`/api/v1/questions/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
  }

  async function handleDelete(id) {
    if (confirm("Tem certeza que deseja excluir esta pergunta?")) {
      await deleteQuestion(id);
      const updated = questions.filter((q) => q.id !== id);
      setQuestions(updated);
      toast.success("Pergunta excluída com sucesso!");
    }
  }

  function getSectionName(sectionId) {
    return sections.find((s) => s.id === sectionId)?.name || "Sem seção";
  }

  const filteredQuestions =
    filterSection === "all"
      ? questions
      : questions.filter((q) => q.sectionId === filterSection);

  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    if (a.sectionId !== b.sectionId) {
      const sectionA = sections.find((s) => s.id === a.sectionId);
      const sectionB = sections.find((s) => s.id === b.sectionId);
      return (sectionA?.order || 0) - (sectionB?.order || 0);
    }
    return a.order - b.order;
  });

  if (sortedQuestions.length > 0) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pergunta</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Seção</TableHead>
            <TableHead className="w-24">Ordem</TableHead>
            <TableHead className="w-32 text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedQuestions.map((question) => (
            <TableRow key={question.id}>
              <TableCell className="max-w-md">
                <div className="flex flex-col gap-1">
                  <span>{question.statement}</span>
                  {question.required && (
                    <Badge variant="secondary" className="w-fit">
                      Obrigatória
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {questionTypeLabels[question.type]}
                </Badge>
              </TableCell>
              <TableCell>{getSectionName(question.sectionId)}</TableCell>
              <TableCell>{question.order}</TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenDialog(question)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(question.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  } else {
    return (
      <p className="text-center text-gray-500 py-8">
        {filterSection === "all"
          ? 'Nenhuma pergunta cadastrada. Clique em "Nova Pergunta" para começar.'
          : "Nenhuma pergunta encontrada nesta seção."}
      </p>
    );
  }
}
