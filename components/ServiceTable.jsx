import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";

export function ServiceTable({
  services,
  setServices,
  filterCategory,
  handleOpenDialog,
}) {
  async function deleteService(serviceName) {
    try {
      await fetch(`/api/v1/services/${serviceName}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  }

  async function handleDelete(service) {
    if (confirm("Tem certeza que deseja excluir este serviço?")) {
      await deleteService(service.name);
      const updated = services.filter((svc) => svc.id !== service.id);
      setServices(updated);
      toast.success("Serviço excluído com sucesso!");
    }
  }

  const filteredServices =
    filterCategory === "all"
      ? services
      : services.filter((service) => service.category === filterCategory);

  if (filteredServices.length > 0)
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredServices.map((service) => (
            <TableRow key={service.id}>
              <TableCell className="font-medium">{service.name}</TableCell>
              <TableCell>{service.category}</TableCell>
              <TableCell>R$ {service.price.toFixed(2)}</TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenDialog(service)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(service)}
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
  else
    return (
      <p className="text-center text-gray-500 py-8">
        {filterCategory === "all"
          ? 'Nenhum serviço cadastrado. Clique em "Novo Serviço" para começar.'
          : "Nenhum serviço encontrado nesta categoria."}
      </p>
    );
}
