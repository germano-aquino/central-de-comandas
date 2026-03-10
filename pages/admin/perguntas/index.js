import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { QuestionDialog } from "@/components/QuestionDialog";
import { QuestionsTable } from "@/components/QuestionsTable";
import { Plus, HelpCircle } from "lucide-react";

import { toast } from "sonner";
import { useState, useEffect } from "react";

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
      const updated = questions.map((question) =>
        question.id === editingQuestion.id
          ? { ...question, ...newQuestion }
          : question,
      );
      setQuestions(updated);
    } else {
      setQuestions([...questions, newQuestion]);
    }
  }

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
                    {sections.map((section) => (
                      <SelectItem key={section.id} value={section.id}>
                        {section.name}
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
            <QuestionsTable
              questions={questions}
              setQuestions={setQuestions}
              sections={sections}
              filterSection={filterSection}
              handleOpenDialog={handleOpenDialog}
            />
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
