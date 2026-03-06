import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import category from "@/models/category";
import service from "@/models/service";
import { ForbiddenError } from "@/infra/errors";
import authorization from "@/models/authorization";
import user from "@/models/user";
import session from "@/models/session";
import { ServiceDialog } from "@/components/ServiceDialog";

function ManageServices({ clientServices, clientCategories }) {
  const [services, setServices] = useState(clientServices);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [filterCategory, setFilterCategory] = useState("all");

  function updateServices(newService, isEditing) {
    if (isEditing) {
      const updated = services.map((service) =>
        service.id === newService.id ? { ...service, ...newService } : service,
      );
      setServices(updated);
    } else {
      const updated = [...services, newService];
      setServices(updated);
    }
  }

  function handleOpenDialog(service) {
    setEditingService(service ? service : null);
    setIsDialogOpen(true);
  }

  function handleCloseDialog() {
    setIsDialogOpen(false);
    setEditingService(null);
  }

  function handleDelete(id) {
    if (confirm("Tem certeza que deseja excluir este serviço?")) {
      const updated = services.filter((svc) => svc.id !== id);
      updateServices(updated);
      toast.success("Serviço excluído com sucesso!");
    }
  }

  const filteredServices =
    filterCategory === "all"
      ? services
      : services.filter((svc) => svc.category === filterCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header subtitle="Gerenciar serviços" Icon={Package} />

      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle>Lista de Serviços</CardTitle>
              <div className="flex gap-4">
                <Select
                  value={filterCategory}
                  onValueChange={setFilterCategory}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filtrar por categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    {clientCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={() => handleOpenDialog()} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Novo Serviço
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredServices.length > 0 ? (
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
                      <TableCell className="font-medium">
                        {service.name}
                      </TableCell>
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
                            onClick={() => handleDelete(service.id)}
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
                {filterCategory === "all"
                  ? 'Nenhum serviço cadastrado. Clique em "Novo Serviço" para começar.'
                  : "Nenhum serviço encontrado nesta categoria."}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog for Create/Edit */}
      <ServiceDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        editingService={editingService}
        clientCategories={clientCategories}
        handleCloseDialog={handleCloseDialog}
        updateServices={updateServices}
      />
    </div>
  );
}

export async function getServerSideProps(context) {
  async function findLoggedUser(request) {
    const userSession = await session.findOneValidByToken(
      request.cookies?.session_id,
    );
    const userRequesting = await user.findOneById(userSession.user_id);

    return userRequesting;
  }

  function checkUserFeatures(user, features) {
    features.forEach((feature) => {
      if (!authorization.can(user, feature))
        throw new ForbiddenError({
          message: "O usuário não possui permissão para executar esta ação.",
          action: `Verifique se o usuário possui a feature "${feature}".`,
        });
    });
  }

  function getCategoryNameById(categories, id) {
    const selectedCategory = categories.find((cat) => cat.id === id);

    return selectedCategory ? selectedCategory.name : null;
  }

  async function getClientServiceObjects() {
    const categories = await category.retrieveAll();
    const services = await service.retrieveAll();

    let order = 1;

    const clientServices = services.map((service) => {
      return {
        id: service.id,
        name: service.name,
        category: getCategoryNameById(categories, service.category_id),
        category_id: service.category_id,
        price: service.price / 100,
        order: order++,
      };
    });

    const clientCategories = categories.map((cat) => {
      return {
        id: cat.id,
        name: cat.name,
      };
    });

    return [clientServices, clientCategories];
  }

  try {
    const { req } = context;
    const userRequesting = await findLoggedUser(req);

    checkUserFeatures(userRequesting, ["read:category", "read:service"]);

    const [clientServices, clientCategories] = await getClientServiceObjects();

    return {
      props: {
        clientServices,
        clientCategories,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
}

export default ManageServices;
