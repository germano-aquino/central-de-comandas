import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Settings,
  FolderTree,
  Package,
  ListChecks,
  HelpCircle,
  NotebookText,
  Store,
} from "lucide-react";

function AdminDashboard() {
  const router = useRouter();
  const adminSections = [
    {
      title: "Categorias de Serviços",
      description: "Gerenciar categorias de serviços da clínica",
      icon: FolderTree,
      path: "/admin/categorias",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Serviços",
      description: "Cadastrar e editar serviços oferecidos",
      icon: Package,
      path: "/admin/servicos",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Seções de Perguntas",
      description: "Criar seções para organizar perguntas da avaliação",
      icon: ListChecks,
      path: "/admin/secoes",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Perguntas",
      description: "Gerenciar perguntas da ficha de avaliação",
      icon: HelpCircle,
      path: "/admin/perguntas",
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
    {
      title: "Comandas",
      description: "Gerenciar formato da comanda dos atendimentos",
      icon: NotebookText,
      path: "/admin/comandas",
      color: "text-amber-600",
      bgColor: "bg-pink-50",
    },
    {
      title: "Lojas",
      description: "Gerenciar unidades de atendimentos",
      icon: Store,
      path: "/admin/lojas",
      color: "text-zinc-600",
      bgColor: "bg-pink-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2>Bem-vindo ao Painel Administrativo</h2>
          <p className="text-gray-600 mt-2">
            Selecione uma opção abaixo para gerenciar o sistema da clínica de
            estética.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminSections.map((section) => {
            const Icon = section.icon;
            return (
              <Card
                key={section.path}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => {
                  router.push(section.path);
                }}
              >
                <CardHeader>
                  <div
                    className={`w-12 h-12 rounded-lg ${section.bgColor} flex items-center justify-center mb-4`}
                  >
                    <Icon className={`w-6 h-6 ${section.color}`} />
                  </div>
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Gerenciar
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

AdminDashboard.subtitle = "Gerenciamento de Sistema";
AdminDashboard.icon = Settings;

export default AdminDashboard;
