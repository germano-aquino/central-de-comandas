import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, Plus, Pencil, Trash2, Package } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function ManageServices() {
  const router = useRouter();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    image:
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400&h=300&fit=crop",
  });
  const [filterCategory, setFilterCategory] = useState("all");

  useEffect(() => {
    loadServices();
    loadCategories();
  }, []);

  function loadServices() {
    const stored = localStorage.getItem("services");
    if (stored) {
      setServices(JSON.parse(stored));
    }
  }

  function loadCategories() {
    const stored = localStorage.getItem("categories");
    if (stored) {
      setCategories(JSON.parse(stored));
    }
  }

  function saveServices(newServices) {
    localStorage.setItem("services", JSON.stringify(newServices));
    setServices(newServices);
  }

  function handleOpenDialog(service) {
    if (service) {
      setEditingService(service);
      setFormData({
        name: service.name,
        description: service.description,
        price: service.price,
        category: service.category,
        image: service.image,
      });
    } else {
      setEditingService(null);
      setFormData({
        name: "",
        description: "",
        price: 0,
        category: categories[0]?.name || "",
        image:
          "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400&h=300&fit=crop",
      });
    }
    setIsDialogOpen(true);
  }

  function handleCloseDialog() {
    setIsDialogOpen(false);
    setEditingService(null);
  }

  function handleSave() {
    if (!formData.name.trim() || !formData.category) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    if (editingService) {
      const updated = services.map((svc) =>
        svc.id === editingService.id ? { ...svc, ...formData } : svc,
      );
      saveServices(updated);
      toast.success("Serviço atualizado com sucesso!");
    } else {
      const newService = {
        id: `svc_${Date.now()}`,
        ...formData,
      };
      saveServices([...services, newService]);
      toast.success("Serviço criado com sucesso!");
    }

    handleCloseDialog();
  }

  function handleDelete(id) {
    if (confirm("Tem certeza que deseja excluir este serviço?")) {
      const updated = services.filter((svc) => svc.id !== id);
      saveServices(updated);
      toast.success("Serviço excluído com sucesso!");
    }
  }

  const filteredServices =
    filterCategory === "all"
      ? services
      : services.filter((svc) => svc.category === filterCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-green-600" />
              <div>
                <h1 className="text-green-600">Serviços</h1>
                <p className="text-sm text-gray-600">
                  Gerenciar serviços oferecidos
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push("/admin")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
          </div>
        </div>
      </header>

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
                    {categories.map((cat) => (
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
                    <TableHead>Descrição</TableHead>
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
                      <TableCell className="max-w-xs truncate">
                        {service.description}
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
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Descrição do serviço"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Preço (R$) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">URL da Imagem</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                placeholder="https://..."
              />
              <p className="text-xs text-gray-500">
                Deixe em branco para usar a imagem padrão
              </p>
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
    </div>
  );
}

export default ManageServices;
