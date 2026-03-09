import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function QuestionDialog({
  isDialogOpen,
  setIsDialogOpen,
  editingQuestion,
  setEditingQuestion,
  updateQuestions,
}) {
  const [formData, setFormData] = useState(
    editingQuestion
      ? editingQuestion
      : {
          text: "",
          type: "yes_no",
          sectionId: "",
          order: 0,
          required: true,
          options: [],
        },
  );
  const [optionsInput, setOptionsInput] = useState("");

  useEffect(() => {
    setFormData(
      editingQuestion
        ? editingQuestion
        : {
            text: "",
            type: "yes_no",
            sectionId: "",
            order: 0,
            required: true,
            options: [],
          },
    );
  }, [editingQuestion]);

  async function createQuestion() {
    try {
      const response = await fetch("api/v1/questions", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          statement: "",
          type: "",
          options: "",
          section_id: "",
        }),
      });

      const responseBody = await response.json();

      if (response.status === 201) {
        const newQuestion = {
          id: responseBody.id,
          statement: responseBody.statement,
          options: responseBody.options,
          section_id: responseBody.section_id,
        };
        updateQuestions(newQuestion, false);
      }
    } catch (error) {
      toast.error("Falha ao criar a pergunta.");
      console.error(error);
    }
  }

  async function handleSave() {
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
      await updateQuestion();
      updateQuestions(newQuestion, true);
      toast.success("Pergunta atualizada com sucesso!");
    } else {
      await createQuestion();
      updateQuestions(newQuestion, false);
      toast.success("Pergunta criada com sucesso!");
    }

    handleCloseDialog();
  }

  function handleCloseDialog() {
    setIsDialogOpen(false);
    setEditingQuestion(null);
    setOptionsInput("");
  }

  return (
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
                  {Object.entries(questionTypeLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
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
  );
}
