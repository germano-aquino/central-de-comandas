import { StoreDialog } from "@/components/StoreDialog";
import { StoresTable } from "@/components/StoresTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Store } from "lucide-react";
import { useEffect, useState } from "react";

function ManageStores({ notifyHeader }) {
  const [stores, setStores] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStore, setEditingStore] = useState({ name: "", order: 0 });

  useEffect(() => {
    loadStores();
  }, []);

  async function loadStores() {
    const response = await fetch("/api/v1/stores");
    const serverStores = await response.json();

    if (response.status === 200) {
      let order = 1;

      const clientStores = serverStores.map((store) => {
        return {
          id: store.id,
          name: store.name,
          order: order++,
        };
      });
      setStores(clientStores);
    }
  }

  function updateStores(newStore, isEditing) {
    if (isEditing) {
      const updated = stores.map((store) =>
        store.id === newStore.id ? { ...store, ...newStore } : store,
      );
      setStores(updated);
    } else {
      const updated = [...stores, newStore];
      setStores(updated);
    }
    notifyHeader();
  }

  function handleOpenDialog(store) {
    setEditingStore(store ? store : null);
    setIsDialogOpen(true);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Lista de Lojas</CardTitle>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="w-4 h-4" />
              Nova Loja
            </Button>
          </CardHeader>
          <CardContent>
            <StoresTable
              stores={stores}
              setStores={setStores}
              handleOpenDialog={handleOpenDialog}
              notifyHeader={notifyHeader}
            />
          </CardContent>
        </Card>
      </div>
      <StoreDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        editingStore={editingStore}
        setEditingStore={setEditingStore}
        updateStores={updateStores}
      />
    </div>
  );
}

ManageStores.headerProps = {
  subtitle: "Gerenciar lojas",
  icon: Store,
};

export default ManageStores;
