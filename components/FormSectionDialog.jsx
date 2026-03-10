import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useEffect, useState } from "react";
import { toast } from "sonner";

export function FormSectionDialog({
  isDialogOpen,
  setIsDialogOpen,
  editingSection,
  setEditingSection,
  updateSections,
}) {
  const [formData, setFormData] = useState(
    editingSection
      ? editingSection
      : {
          name: "",
          id: "",
          order: 0,
        },
  );

  useEffect(() => {
    setFormData(
      editingSection
        ? editingSection
        : {
            name: "",
            id: "",
            order: 0,
          },
    );
  }, [editingSection]);

  async function createSection() {
    const response = await fetch("/api/v1/form/sections", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name: formData.name,
      }),
    });

    const responseBody = await response.json();

    if (response.status === 201) {
      const newSection = {
        id: responseBody.id,
        name: formData.name,
        order: formData.order,
      };

      updateSections(newSection, false);
    } else {
      toast.error("Falha ao criar seção de perguntas.");
      console.error(responseBody.message, responseBody.status);
      return;
    }
  }

  async function updateSection() {
    const response = await fetch(
      `/api/v1/form/sections/${editingSection.name}`,
      {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
        }),
      },
    );

    const responseBody = await response.json();

    if (response.status === 200) {
      const newSection = {
        id: responseBody.id,
        name: formData.name,
        order: formData.order,
      };

      updateSections(newSection, true);
    } else {
      toast.error("Falha ao atualizar seção de perguntas.");
      console.error(responseBody.message, responseBody.status);
    }
  }

  async function handleSave() {
    if (!formData.name.trim()) {
      toast.error("Por favor, preencha o nome da seção");
      return;
    }

    if (editingSection) {
      await updateSection();
      toast.success("Seção atualizada com sucesso!");
    } else {
      await createSection();
      toast.success("Seção criada com sucesso!");
    }

    handleCloseDialog();
  }

  function handleCloseDialog() {
    setIsDialogOpen(false);
    setEditingSection(null);
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingSection ? "Editar Seção" : "Nova Seção"}
          </DialogTitle>
          <DialogDescription>
            Preencha os dados da seção de perguntas.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Seção</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Ex: Depilação"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="order">Ordem de Exibição</Label>
            <Input
              id="order"
              type="number"
              value={formData.order}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  order: parseInt(e.target.value),
                })
              }
              placeholder="1"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCloseDialog}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            {editingSection ? "Salvar Alterações" : "Criar Seção"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
