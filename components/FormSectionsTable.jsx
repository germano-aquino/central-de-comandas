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

export function FormSectionsTable({ sections, setSections, handleOpenDialog }) {
  async function deleteSection(sectionName) {
    try {
      await fetch(`/api/v1/form/sections/${sectionName}`, {
        method: "DELETE",
      });
    } catch (error) {
      toast.error("Falha ao deletar a seção de perguntas.");
      console.error(error);
    }
  }

  async function handleDelete(sectionName) {
    if (
      confirm(
        "Tem certeza que deseja excluir esta seção? As perguntas associadas não serão excluídas.",
      )
    ) {
      await deleteSection(sectionName);
      const updated = sections.filter(
        (section) => section.name !== sectionName,
      );
      setSections(updated);
      toast.success("Seção excluída com sucesso!");
    }
  }

  function moveSection(index, direction) {
    const sorted = [...sections].sort((a, b) => a.order - b.order);
    const newIndex = direction === "up" ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= sorted.length) return;

    const temp = sorted[index].order;
    sorted[index].order = sorted[newIndex].order;
    sorted[newIndex].order = temp;

    setSections(sorted);
  }

  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  if (sortedSections.length > 0) {
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
          {sortedSections.map((section, index) => (
            <TableRow key={section.id}>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveSection(index, "up")}
                    disabled={index === 0}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  >
                    <GripVertical className="w-4 h-4" />
                  </button>
                </div>
              </TableCell>
              <TableCell className="font-medium">{section.name}</TableCell>
              <TableCell>{section.order}</TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenDialog(section)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(section.name)}
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
        Nenhuma seção cadastrada. Clique em &ldquo;Nova Seção&rdquo; para
        começar.
      </p>
    );
  }
}
