import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  ListChecks,
  GripVertical,
} from "lucide-react";
import { toast } from "sonner";

function ManageQuestionSections() {
  const router = useRouter();
  const [sections, setSections] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    order: 0,
  });

  useEffect(() => {
    loadSections();
  }, []);

  function loadSections() {
    const stored = localStorage.getItem("questionSections");
    if (stored) {
      setSections(JSON.parse(stored));
    } else {
      // Default sections
      const defaultSections = [
        {
          id: "sec1",
          name: "Depilação",
          description: "Perguntas relacionadas a depilação",
          order: 1,
        },
        {
          id: "sec2",
          name: "Sobrancelhas",
          description: "Perguntas sobre design de sobrancelhas",
          order: 2,
        },
        {
          id: "sec3",
          name: "Esmalteria",
          description: "Perguntas sobre serviços de esmalteria",
          order: 3,
        },
        {
          id: "sec4",
          name: "Alta Frequência",
          description: "Perguntas sobre tratamentos de alta frequência",
          order: 4,
        },
        {
          id: "sec5",
          name: "Uso de Imagens",
          description: "Autorização para uso de imagens",
          order: 5,
        },
      ];
      setSections(defaultSections);
      localStorage.setItem("questionSections", JSON.stringify(defaultSections));
    }
  }

  function saveSections(newSections) {
    localStorage.setItem("questionSections", JSON.stringify(newSections));
    setSections(newSections);
  }

  function handleOpenDialog(section) {
    if (section) {
      setEditingSection(section);
      setFormData({
        name: section.name,
        description: section.description,
        order: section.order,
      });
    } else {
      setEditingSection(null);
      setFormData({ name: "", description: "", order: sections.length + 1 });
    }
    setIsDialogOpen(true);
  }

  function handleCloseDialog() {
    setIsDialogOpen(false);
    setEditingSection(null);
    setFormData({ name: "", description: "", order: 0 });
  }

  function handleSave() {
    if (!formData.name.trim()) {
      toast.error("Por favor, preencha o nome da seção");
      return;
    }

    if (editingSection) {
      const updated = sections.map((sec) =>
        sec.id === editingSection.id
          ? {
              ...sec,
              name: formData.name,
              description: formData.description,
              order: formData.order,
            }
          : sec,
      );
      saveSections(updated);
      toast.success("Seção atualizada com sucesso!");
    } else {
      const newSection = {
        id: `sec_${Date.now()}`,
        name: formData.name,
        description: formData.description,
        order: formData.order,
      };
      saveSections([...sections, newSection]);
      toast.success("Seção criada com sucesso!");
    }

    handleCloseDialog();
  }

  function handleDelete(id) {
    if (
      confirm(
        "Tem certeza que deseja excluir esta seção? As perguntas associadas não serão excluídas.",
      )
    ) {
      const updated = sections.filter((sec) => sec.id !== id);
      saveSections(updated);
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

    saveSections(sorted);
  }

  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ListChecks className="w-8 h-8 text-purple-600" />
              <div>
                <h1 className="text-purple-600">Seções de Perguntas</h1>
                <p className="text-sm text-gray-600">
                  Organizar perguntas em seções
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
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Lista de Seções</CardTitle>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="w-4 h-4" />
              Nova Seção
            </Button>
          </CardHeader>
          <CardContent>
            {sortedSections.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Descrição</TableHead>
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
                      <TableCell className="font-medium">
                        {section.name}
                      </TableCell>
                      <TableCell className="max-w-md truncate">
                        {section.description}
                      </TableCell>
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
                            onClick={() => handleDelete(section.id)}
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
                Nenhuma seção cadastrada. Clique em &ldquo;Nova Seção&rdquo;
                para começar.
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
              {editingSection ? "Editar Seção" : "Nova Seção"}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados da seção de perguntas.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Seção</Label>
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
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Descrição da seção"
                rows={3}
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
              {editingSection ? "Salvar Alterações" : "Criar Seção"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ManageQuestionSections;
