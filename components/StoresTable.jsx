import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { GripVertical, Pencil, Trash2 } from "lucide-react";

import { toast } from "sonner";

export function StoresTable({ stores, setStores, handleOpenDialog }) {
  async function deleteStore(storeName) {
    try {
      await fetch(`/api/v1/stores/${storeName}`, {
        method: "DELETE",
      });
    } catch (error) {
      toast.error("Falha ao deletar a loja.");
      console.error(error);
    }
  }

  async function handleDelete(storeName) {
    if (
      confirm(
        "Tem certeza que deseja excluir esta seção? As perguntas associadas não serão excluídas.",
      )
    ) {
      await deleteStore(storeName);
      const updated = stores.filter((store) => store.name !== storeName);
      setStores(updated);
      toast.success("Seção excluída com sucesso!");
    }
  }

  function moveStore(index, direction) {
    const sorted = [...stores].sort((a, b) => a.order - b.order);
    const newIndex = direction === "up" ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= sorted.length) return;

    const temp = sorted[index].order;
    sorted[index].order = sorted[newIndex].order;
    sorted[newIndex].order = temp;

    setStores(sorted);
  }

  const sortedStores = [...stores].sort((a, b) => a.order - b.order);

  if (sortedStores.length > 0) {
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
          {sortedStores.map((store, index) => (
            <TableRow key={store.id}>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveStore(index, "up")}
                    disabled={index === 0}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  >
                    <GripVertical className="w-4 h-4" />
                  </button>
                </div>
              </TableCell>
              <TableCell className="font-medium">{store.name}</TableCell>
              <TableCell>{store.order}</TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenDialog(store)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(store.name)}
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
        Nenhuma loja cadastrada. Clique em &ldquo;Nova Loja&rdquo; para começar.
      </p>
    );
  }
}
