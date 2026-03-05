import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Plus, Pencil, Trash2, FolderTree, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { CategoryDialog } from "@/components/CategoryDialog";

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
    setEditingCategory(category ? category : null);
    setIsDialogOpen(true);
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

// export async function getServerSideProps(context) {
//   async function findLoggedUser(request) {
//     const userSession = await session.findOneValidByToken(
//       request.cookies?.session_id,
//     );
//     const userRequesting = await user.findOneById(userSession.user_id);

//     return userRequesting;
//   }

//   function checkUserFeatures(user, features) {
//     features.forEach((feature) => {
//       if (!authorization.can(user, feature))
//         throw new ForbiddenError({
//           message: "O usuário não possui permissão para executar esta ação.",
//           action: `Verifique se o usuário possui a feature "${feature}".`,
//         });
//     });
//   }

//   function getCategoryNameById(categories, id) {
//     const selectedCategory = categories.find((cat) => cat.id === id);

//     return selectedCategory ? selectedCategory.name : null;
//   }

//   async function getClientServiceObjects() {
//     const categories = await category.retrieveAll();
//     const services = await service.retrieveAll();

//     const clientServices = services.map((service) => {
//       return {
//         name: service.name,
//         category: getCategoryNameById(categories, service.category_id),
//         category_id: service.category_id,
//         price: service.price / 100,
//       };
//     });

//     const clientCategories = categories.map((cat) => {
//       return {
//         id: cat.id,
//         name: cat.name,
//       };
//     });

//     return [clientServices, clientCategories];
//   }

//   try {
//     const { req } = context;
//     const userRequesting = await findLoggedUser(req);

//     checkUserFeatures(userRequesting, ["read:category", "read:service"]);

//     const [clientServices, clientCategories] = await getClientServiceObjects();

//     return {
//       props: {
//         clientServices,
//         clientCategories,
//       },
//     };
//   } catch (error) {
//     console.error(error);
//     return {
//       redirect: {
//         destination: "/login",
//         permanent: false,
//       },
//     };
//   }
// }

export default ManageCategories;
