import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServiceDialog } from "@/components/ServiceDialog";
import { ServiceTable } from "@/components/ServiceTable";

import { useEffect, useState } from "react";
import { Plus, Package } from "lucide-react";

function ManageServices() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [filterCategory, setFilterCategory] = useState("all");

  useEffect(() => {
    async function loadServicesAndCategories() {
      const categoryResponse = await fetch("/api/v1/categories");

      const storedCategories = await categoryResponse.json();
      let categoryOrder = 0;
      const categoriesMap = new Map();
      const newCategories = storedCategories.map((category) => {
        categoriesMap.set(category.id, category.name);
        return {
          id: category.id,
          name: category.name,
          order: ++categoryOrder,
        };
      });
      setCategories(newCategories);

      const serviceResponse = await fetch("/api/v1/services");

      const storedServices = await serviceResponse.json();
      let serviceOrder = 0;
      const newServices = storedServices.map((service) => {
        return {
          id: service.id,
          name: service.name,
          price: service.price / 100,
          category_id: service.category_id,
          category: categoriesMap.get(service.category_id),
          order: ++serviceOrder,
        };
      });
      setServices(newServices);
    }

    loadServicesAndCategories();
  }, []);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
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
            <ServiceTable
              services={services}
              setServices={setServices}
              filterCategory={filterCategory}
              handleOpenDialog={handleOpenDialog}
            />
          </CardContent>
        </Card>
      </div>

      {/* Dialog for Create/Edit */}
      <ServiceDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        editingService={editingService}
        clientCategories={categories}
        handleCloseDialog={handleCloseDialog}
        updateServices={updateServices}
      />
    </div>
  );
}

ManageServices.subtitle = "Gerenciar serviços";
ManageServices.icon = Package;

export default ManageServices;
