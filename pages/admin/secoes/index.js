import { FormSectionDialog } from "@/components/FormSectionDialog";
import { FormSectionsTable } from "@/components/FormSectionsTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Plus, ListChecks } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";

function ManageQuestionSections() {
  const [sections, setSections] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null);

  useEffect(() => {
    loadSections();
  }, []);

  async function loadSections() {
    const response = await fetch("/api/v1/form/sections");

    const storedSections = await response.json();

    if (response.status !== 200) {
      toast.error("Falha ao carrega as seções de perguntas.");
      console.error(storedSections.message);
      return;
    }

    let order = 1;

    const sections = storedSections.map((section) => {
      return {
        id: section.id,
        name: section.name,
        order: order++,
      };
    });
    setSections(sections);
  }

  function updateSections(newSection, isEditing) {
    if (isEditing) {
      const updated = sections.map((section) =>
        section.id === editingSection.id
          ? { ...section, name: newSection.name, order: newSection.order }
          : section,
      );
      setSections(updated);
    } else {
      setSections([...sections, newSection]);
    }
  }

  function handleOpenDialog(section) {
    setEditingSection(section ? section : null);
    setIsDialogOpen(true);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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
            <FormSectionsTable
              sections={sections}
              setSections={setSections}
              handleOpenDialog={handleOpenDialog}
            />
          </CardContent>
        </Card>
      </div>
      <FormSectionDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        editingSection={editingSection}
        setEditingSection={setEditingSection}
        updateSections={updateSections}
      />
    </div>
  );
}

ManageQuestionSections.headerProps = {
  subtitle: "Organizar perguntas em seções",
  icon: ListChecks,
};

export default ManageQuestionSections;
