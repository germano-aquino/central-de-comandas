import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Pencil, Trash2, HelpCircle } from "lucide-react";
import { toast } from "sonner";

const questionTypeLabels = {
  yes_no: "Sim/Não",
  text: "Texto curto",
  textarea: "Texto longo",
  checkbox: "Múltipla escolha",
  radio: "Escolha única",
};

function ManageQuestions() {
  const router = useRouter();
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
  const [optionsInput, setOptionsInput] = useState("");

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

  function handleCloseDialog() {
    setIsDialogOpen(false);
    setEditingQuestion(null);
    setOptionsInput("");
  }

  function handleSave() {
    if (!formData.text?.trim() || !formData.sectionId) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    const questionData = { ...formData };

    // Parse options for checkbox/radio
    if (
      (formData.type === "checkbox" || formData.type === "radio") &&
      optionsInput.trim()
    ) {
      questionData.options = optionsInput
        .split("\n")
        .filter((opt) => opt.trim());
    }

    if (editingQuestion) {
      const updated = questions.map((q) =>
        q.id === editingQuestion.id ? { ...q, ...questionData } : q,
      );
      saveQuestions(updated);
      toast.success("Pergunta atualizada com sucesso!");
    } else {
      const newQuestion = {
        id: `q_${Date.now()}`,
        ...questionData,
      };
      saveQuestions([...questions, newQuestion]);
      toast.success("Pergunta criada com sucesso!");
    }

    handleCloseDialog();
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
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-8 h-8 text-pink-600" />
              <div>
                <h1 className="text-pink-600">Perguntas</h1>
                <p className="text-sm text-gray-600">
                  Gerenciar perguntas da avaliação
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push("/admin")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
          </div>
        </div>
      </header>

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

      {/* Dialog for Create/Edit */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingQuestion ? "Editar Pergunta" : "Nova Pergunta"}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados da pergunta da ficha de avaliação.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="text">Texto da Pergunta *</Label>
              <Textarea
                id="text"
                value={formData.text}
                onChange={(e) =>
                  setFormData({ ...formData, text: e.target.value })
                }
                placeholder="Ex: Já realizou depilação com cera antes?"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Pergunta *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(questionTypeLabels).map(
                      ([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="section">Seção *</Label>
                <Select
                  value={formData.sectionId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, sectionId: value })
                  }
                >
                  <SelectTrigger id="section">
                    <SelectValue placeholder="Selecione uma seção" />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map((sec) => (
                      <SelectItem key={sec.id} value={sec.id}>
                        {sec.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {(formData.type === "checkbox" || formData.type === "radio") && (
              <div className="space-y-2">
                <Label htmlFor="options">Opções (uma por linha)</Label>
                <Textarea
                  id="options"
                  value={optionsInput}
                  onChange={(e) => setOptionsInput(e.target.value)}
                  placeholder="Opção 1&#10;Opção 2&#10;Opção 3"
                  rows={5}
                />
                <p className="text-xs text-gray-500">
                  Digite cada opção em uma linha separada
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="order">Ordem de Exibição</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      order: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="required">Pergunta Obrigatória?</Label>
                <Select
                  value={formData.required ? "yes" : "no"}
                  onValueChange={(value) =>
                    setFormData({ ...formData, required: value === "yes" })
                  }
                >
                  <SelectTrigger id="required">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Sim</SelectItem>
                    <SelectItem value="no">Não</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {editingQuestion ? "Salvar Alterações" : "Criar Pergunta"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ManageQuestions;
