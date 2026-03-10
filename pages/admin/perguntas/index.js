import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { QuestionDialog } from "@/components/QuestionDialog";

export const questionTypeLabels = {
  "multiple-choice": "Múltipla Escolha",
  both: "Múltipla escolha com justificativa",
  discursive: "Discursiva",
};

function ManageQuestions() {
  const [questions, setQuestions] = useState([]);
  const [sections, setSections] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [filterSection, setFilterSection] = useState("all");

  useEffect(() => {
    loadQuestions();
    loadSections();
  }, []);

  async function loadQuestions() {
    const response = await fetch("/api/v1/questions");
    const storedQuestions = await response.json();

    if (response.status === 200) {
      let order = 1;
      const clientQuestions = storedQuestions.map((question) => {
        return {
          id: question.id,
          statement: question.statement,
          type: question.type,
          sectionId: question.section_id,
          options: question.options,
          order: order++,
        };
      });
      setQuestions(clientQuestions);
    } else {
      console.error(storedQuestions);
    }
  }

  async function loadSections() {
    try {
      const response = await fetch("/api/v1/form/sections");
      const storedSections = await response.json();

      let order = 1;
      const clientSections = storedSections.map((section) => {
        return {
          id: section.id,
          name: section.name,
          order: order++,
        };
      });
      setSections(clientSections);
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
  }

  function handleOpenDialog(question) {
    setEditingQuestion(question ? question : null);
    setIsDialogOpen(true);
  }

  function updateQuestions(newQuestion, isEditing) {
    if (isEditing) {
      const updated = questions.map((q) =>
        q.id === editingQuestion.id ? { ...q, ...newQuestion } : q,
      );
      setQuestions(updated);
    } else {
      setQuestions([...questions, newQuestion]);
    }
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header
        title="Clube Depil"
        subtitle="Gerenciar perguntas"
        Icon={HelpCircle}
      />

      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle>Lista de Perguntas</CardTitle>
              <div className="flex gap-4">
                <Select value={filterSection} onValueChange={setFilterSection}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filtrar por seção" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as seções</SelectItem>
                    {sections.map((sec) => (
                      <SelectItem key={sec.id} value={sec.id}>
                        {sec.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={() => handleOpenDialog()} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Nova Pergunta
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {sortedQuestions.length > 0 ? (
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
                      <TableCell>
                        {getSectionName(question.sectionId)}
                      </TableCell>
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
            ) : (
              <p className="text-center text-gray-500 py-8">
                {filterSection === "all"
                  ? 'Nenhuma pergunta cadastrada. Clique em "Nova Pergunta" para começar.'
                  : "Nenhuma pergunta encontrada nesta seção."}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
      <QuestionDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        editingQuestion={editingQuestion}
        setEditingQuestion={setEditingQuestion}
        updateQuestions={updateQuestions}
        sections={sections}
      />
    </div>
  );
}

export default ManageQuestions;
