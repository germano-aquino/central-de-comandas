import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Plus, FolderTree } from "lucide-react";
import { Header } from "@/components/Header";
import { CategoryDialog } from "@/components/CategoryDialog";
import { CategoriesTable } from "@/components/CategoriesTable";

function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    const response = await fetch("/api/v1/categories");

    const storedCategories = await response.json();
    let order = 0;
    const newCategories = storedCategories.map((cat) => {
      return {
        id: cat.id,
        name: cat.name,
        order: ++order,
      };
    });
    setCategories(newCategories);
  }

  function updateCategories(newCategory, isEditing) {
    if (isEditing) {
      const updated = categories.map((cat) =>
        cat.id === editingCategory.id
          ? { ...cat, name: newCategory.name, order: newCategory.order }
          : cat,
      );
      setCategories(updated);
    } else {
      setCategories([...categories, newCategory]);
    }
  }

  function handleOpenDialog(category) {
    const oldCategory = category ? category : null;
    setEditingCategory(oldCategory);
    setIsDialogOpen(true);
  }

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
            <CategoriesTable
              categories={categories}
              setCategories={setCategories}
              handleOpenDialog={handleOpenDialog}
            />
          </CardContent>
        </Card>
      </div>

      <CategoryDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        editingCategory={editingCategory}
        setEditingCategory={setEditingCategory}
        updateCategories={updateCategories}
      />
    </div>
  );
}

export default ManageCategories;
