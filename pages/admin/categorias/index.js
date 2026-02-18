import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Plus, Pencil, Trash2, FolderTree, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/Header";

function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "", order: 0 });

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    const response = await fetch("/api/v1/categories");
    const storedCategories = await response.json();
    let i = 0;
    const newCategories = storedCategories.map((cat) => {
      return {
        id: cat.id,
        name: cat.name,
        order: ++i,
      };
    });
    setCategories(newCategories);
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
        toast.success("Categoria atualizada com sucesso!");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  }

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
        const newCategory = await response.json();
        return {
          id: newCategory.id,
          name: newCategory.name,
          order: formData.order,
        };
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  }

  async function deleteCategory(categoryName) {
    try {
      await fetch(`/api/v1/categories/${categoryName}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  }

  function handleOpenDialog(category) {
    if (category) {
      setEditingCategory(category);
      setFormData({ name: category.name, order: category.order });
    } else {
      setEditingCategory(null);
      setFormData({ name: "", order: categories.length + 1 });
    }
    setIsDialogOpen(true);
  }

  function handleCloseDialog() {
    setIsDialogOpen(false);
    setEditingCategory(null);
    setFormData({ name: "", order: 0 });
  }

  async function handleSave() {
    if (!formData.name.trim()) {
      toast.error("Por favor, preencha o nome da categoria");
      return;
    }

    if (editingCategory) {
      // Edit existing
      await updateCategory();
      const updated = categories.map((cat) =>
        cat.id === editingCategory.id
          ? { ...cat, name: formData.name, order: formData.order }
          : cat,
      );
      setCategories(updated);
      toast.success("Categoria atualizada com sucesso!");
    } else {
      //Create new category
      const newCategory = await createCategory();
      setCategories([...categories, newCategory]);
      toast.success("Categoria criada com sucesso!");
    }

    handleCloseDialog();
  }

  async function handleDelete(categoryName) {
    if (confirm("Tem certeza que deseja excluir esta categoria?")) {
      await deleteCategory(categoryName);
      const updated = categories.filter((cat) => cat.name !== categoryName);
      setCategories(updated);
      toast.success("Categoria excluída com sucesso!");
    }
  }

  function moveCategory(index, direction) {
    const sorted = [...categories].sort((a, b) => a.order - b.order);
    const newIndex = direction === "up" ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= sorted.length) return;

    const temp = sorted[index].order;
    sorted[index].order = sorted[newIndex].order;
    sorted[newIndex].order = temp;

    setCategories(sorted);
  }

  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header
        title="Clube Depil"
        subtitle="Gerenciar categorias"
        Icon={FolderTree}
      />

      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Lista de Categorias</CardTitle>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="w-4 h-4" />
              Nova Categoria
            </Button>
          </CardHeader>
          <CardContent>
            {sortedCategories.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead className="w-24">Ordem</TableHead>
                    <TableHead className="w-32 text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedCategories.map((category, index) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => moveCategory(index, "up")}
                            disabled={index === 0}
                            className="text-gray-400 hover:cursor-pointer hover:text-gray-600 disabled:opacity-30"
                          >
                            <GripVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </TableCell>
                      <TableCell>{category.name}</TableCell>
                      <TableCell>{category.order}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDialog(category)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(category.name)}
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
                Nenhuma categoria cadastrada. Clique em &ldquo;Nova
                Categoria&rdquo; para começar.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog for Create/Edit */}
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
                    order: parseInt(e.target.value) || 0,
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
    </div>
  );
}

export default ManageCategories;
