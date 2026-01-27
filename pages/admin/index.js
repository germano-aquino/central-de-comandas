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
  ArrowLeft,
  FolderTree,
  Package,
  ListChecks,
  HelpCircle,
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
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="w-8 h-8 text-gray-700" />
              <div>
                <h1 className="text-gray-700">Painel Administrativo</h1>
                <p className="text-sm text-gray-600">
                  Gerenciamento do Sistema
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => router.push("/")}
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
          </div>
        </div>
      </header>

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
              // <Link href={section.path} key={section.path}>
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
              // </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
