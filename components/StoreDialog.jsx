import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

import { toast } from "sonner";
import { useEffect, useState } from "react";

export function StoreDialog({
  isDialogOpen,
  updateStores,
  setIsDialogOpen,
  editingStore,
  setEditingStore,
}) {
  useEffect(() => {
    setFormData(editingStore ? editingStore : { name: "", order: 0 });
  }, [editingStore]);

  const [formData, setFormData] = useState(
    editingStore ? editingStore : { name: "", order: 0 },
  );

  async function createStore() {
    try {
      const response = await fetch(`/api/v1/stores/`, {
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
        const newStore = {
          id: responseBody.id,
          name: responseBody.name,
          order: formData.order,
        };
        updateStores(newStore, false);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  }

  async function updateStore() {
    try {
      const response = await fetch(`/api/v1/stores/${editingStore.name}`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
        }),
      });
      if (response.status === 200) {
        updateStores(formData, true);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  }

  function handleCloseDialog() {
    setIsDialogOpen(false);
    setEditingStore({ name: "", order: 0 });
  }

  async function handleSave() {
    if (!formData.name.trim()) {
      toast.error("Por favor, preencha o nome da loja");
      console.error("Nome vazio");
      return;
    }

    if (editingStore) {
      // Edit existing Store
      await updateStore();

      toast.success("Categoria atualizada com sucesso!");
    } else {
      //Create new Store
      await createStore();

      toast.success("Categoria criada com sucesso!");
    }

    handleCloseDialog();
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingStore ? "Editar Loja" : "Nova Loja"}
          </DialogTitle>
          <DialogDescription>
            Preencha os dados da unidade de atendimento.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Loja</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Ex: Clube Depil 14 de Abril"
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
            {editingStore ? "Salvar Alterações" : "Criar Loja"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
