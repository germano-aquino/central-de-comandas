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

const questionTypeLabels = {
  yes_no: "Sim/Não",
  text: "Texto curto",
  textarea: "Texto longo",
  checkbox: "Múltipla escolha",
  radio: "Escolha única",
};

function ManageQuestions() {
  const [questions, setQuestions] = useState([]);
  const [sections, setSections] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [formData, setFormData] = useState({
    text: "",
    type: "yes_no",
    sectionId: "",
    order: 0,
    required: true,
    options: [],
  });
  const [filterSection, setFilterSection] = useState("all");

  useEffect(() => {
    loadQuestions();
    loadSections();
  }, []);

  function loadQuestions() {
    const stored = localStorage.getItem("questions");
    if (stored) {
      setQuestions(JSON.parse(stored));
    } else {
      // Default questions
      const defaultQuestions = [
        {
          id: "q1",
          text: "Já realizou depilação com cera antes?",
          type: "yes_no",
          sectionId: "sec1",
          order: 1,
          required: true,
        },
        {
          id: "q2",
          text: "Apresenta alguma alergia?",
          type: "yes_no",
          sectionId: "sec1",
          order: 2,
          required: true,
        },
        {
          id: "q3",
          text: "Está usando algum medicamento?",
          type: "yes_no",
          sectionId: "sec1",
          order: 3,
          required: true,
        },
      ];
      setQuestions(defaultQuestions);
      localStorage.setItem("questions", JSON.stringify(defaultQuestions));
    }
  }

  function loadSections() {
    const stored = localStorage.getItem("questionSections");
    if (stored) {
      setSections(JSON.parse(stored));
    }
  }

  function saveQuestions(newQuestions) {
    localStorage.setItem("questions", JSON.stringify(newQuestions));
    setQuestions(newQuestions);
  }

  function handleOpenDialog(question) {
    if (question) {
      setEditingQuestion(question);
      setFormData(question);
      if (question.options) {
        setOptionsInput(question.options.join("\n"));
      }
    } else {
      setEditingQuestion(null);
      const nextOrder =
        questions.filter((q) => q.sectionId === filterSection).length + 1;
      setFormData({
        text: "",
        type: "yes_no",
        sectionId:
          filterSection !== "all" ? filterSection : sections[0]?.id || "",
        order: nextOrder,
        required: true,
        options: [],
      });
      setOptionsInput("");
    }
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

  function handleDelete(id) {
    if (confirm("Tem certeza que deseja excluir esta pergunta?")) {
      const updated = questions.filter((q) => q.id !== id);
      saveQuestions(updated);
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
                          <span>{question.text}</span>
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
      />
    </div>
  );
}

export default ManageQuestions;
