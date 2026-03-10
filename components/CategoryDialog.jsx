import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

export function CategoryDialog({
  isDialogOpen,
  setIsDialogOpen,
  editingCategory,
  setEditingCategory,
  updateCategories,
}) {
  const [formData, setFormData] = useState(
    editingCategory ? editingCategory : { name: "", order: 0 },
  );

  useEffect(() => {
    setFormData(editingCategory ? editingCategory : { name: "", order: 0 });
  }, [editingCategory]);

  async function createCategory() {
    try {
      const response = await fetch(`/api/v1/categories/`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
        }),
      });

      if (response.status === 201) {
        const responseBody = await response.json();
        const newCategory = {
          id: responseBody.id,
          name: responseBody.name,
          order: formData.order,
        };
        updateCategories(newCategory, false);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  }

  async function updateCategory() {
    try {
      const response = await fetch(
        `/api/v1/categories/${editingCategory.name}`,
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
      if (response.status === 200) {
        updateCategories(formData, true);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  }

  function handleCloseDialog() {
    setIsDialogOpen(false);
    setEditingCategory({ name: "", order: 0 });
  }

  async function handleSave() {
    if (!formData.name.trim()) {
      toast.error("Por favor, preencha o nome da categoria");
      return;
    }

    if (editingCategory) {
      // Edit existing
      await updateCategory();

      toast.success("Categoria atualizada com sucesso!");
    } else {
      //Create new category
      await createCategory();

      toast.success("Categoria criada com sucesso!");
    }

    handleCloseDialog();
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingCategory ? "Editar Categoria" : "Nova Categoria"}
          </DialogTitle>
          <DialogDescription>
            Preencha os dados da categoria de serviços.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Categoria</Label>
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
            {editingCategory ? "Salvar Alterações" : "Criar Categoria"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
