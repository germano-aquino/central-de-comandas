import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";

import { Pencil, Trash2, GripVertical } from "lucide-react";
import { toast } from "sonner";

export function CategoriesTable({
  categories,
  setCategories,
  handleOpenDialog,
}) {
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

  if (sortedCategories.length) {
    return (
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
    );
  } else {
    return (
      <p className="text-center text-gray-500 py-8">
        Nenhuma categoria cadastrada. Clique em &ldquo;Nova Categoria&rdquo;
        para começar.
      </p>
    );
  }
}
