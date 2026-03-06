import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { toast } from "sonner";
import { useEffect, useState } from "react";

export function ServiceDialog({
  isDialogOpen,
  setIsDialogOpen,
  editingService,
  clientCategories,
  handleCloseDialog,
  updateServices,
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    order: 0,
  });

  useEffect(() => {
    setFormData(
      editingService
        ? editingService
        : {
            name: "",
            description: "",
            price: 0,
            category: "",
            order: 0,
          },
    );
  }, [editingService]);

  function getCategoryIdByName(categoryName) {
    const category = clientCategories.find(
      (category) => category.name === categoryName,
    );
    return category.id;
  }

  async function createService() {
    try {
      console.log(formData);
      const response = await fetch("/api/v1/services", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          cateogry_id: getCategoryIdByName(formData.category),
          price: parseInt(formData.price * 100),
        }),
      });

      if (response.status === 201) {
        const responseBody = await response.json();
        const newService = {
          id: responseBody.id,
          name: responseBody.name,
          category: clientCategories.find(
            (cat) => cat.id === responseBody.catgory_id,
          ).name,
          price: responseBody.price / 100,
          order: formData.order,
        };
        updateServices(newService, false);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function updateService() {
    try {
      console.log(formData);
      const response = await fetch(
        `/api/v1/categories/${editingService.name}`,
        {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            price: parseInt(formData.price * 100),
            category_id: getCategoryIdByName(formData.category),
          }),
        },
      );
      if (response.status === 200) {
        updateServices(formData, true);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  }

  async function handleSave() {
    if (!formData.name.trim() || !formData.category) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    if (editingService) {
      await updateService();
      toast.success("Serviço atualizado com sucesso!");
    } else {
      await createService();
      toast.success("Serviço criado com sucesso!");
    }

    handleCloseDialog();
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingService ? "Editar Serviço" : "Novo Serviço"}
          </DialogTitle>
          <DialogDescription>Preencha os dados do serviço.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Serviço *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Ex: Depilação Axilas"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {clientCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

            <div className="space-y-2">
              <Label htmlFor="price">Preço (R$) *</Label>
              <Input
                id="price"
                type="number"
                step="1"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: parseFloat(e.target.value),
                  })
                }
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCloseDialog}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            {editingService ? "Salvar Alterações" : "Criar Serviço"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
