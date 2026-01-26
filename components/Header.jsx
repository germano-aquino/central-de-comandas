import * as React from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sparkles, MenuIcon } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useRouter } from "next/navigation";

const NAVIGATION_DATA = [
  {
    href: "/admin/lojas",
    title: "Lojas",
    description: "Criação de unidades de atendimento.",
  },
  {
    href: "/admin/usuarios",
    title: "Usuários",
    description: "Criação de usuários.",
  },
  {
    href: "/admin/clientes",
    title: "Clientes",
    description: "Criação de clientes.",
  },
  {
    href: "/admin/servicos",
    title: "Serviços",
    description: "Criação de Serviços",
  },
  {
    href: "/admin/categorias",
    title: "Categorias de Serviços",
    description: "Criação das Categorias de Servios.",
  },
  {
    href: "/admin/secoes",
    title: "Seções de Perguntas",
    description: "Criação das Seções de Perguntas presente no formulário.",
  },
  {
    href: "/admin/perguntas",
    title: "Categorias de Perguntas",
    description: "Criação de Perguntas para o formulário.",
  },
  {
    href: "/atendimento",
    title: "Atendimentos",
    description: "",
  },
];

export function Header() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex item-center justify-between">
        <div className="flex items-center gap-3">
          <Sparkles className="w-4 h-4 md:w-8 md:h-8 text-pink-600" />
          <div>
            <h1 className="text-pink-600 text-sm md:text-base">Clube Depil</h1>
            <p className="text-gray-600 text-xs md:text-sm">
              Escolha seus serviços!
            </p>
          </div>
        </div>
        <NavigationMenuBar />
        <NavigationMenuDropdown />
      </div>
    </header>
  );
}

function NavigationMenuDropdown() {
  return (
    <div className="flex items-center gap-6 md:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <MenuIcon />
            <span className="sr-only">Menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuGroup>
            {NAVIGATION_DATA.map((item, index) => (
              <DropdownMenuItem key={index}>
                <a href={item.href}>{item.title}</a>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function NavigationMenuBar() {
  const router = useRouter();

  return (
    <NavigationMenu className="max-md:hidden">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className="hover:cursor-pointer"
            onClick={() => router.push("/admin")}
          >
            Cadastro
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="w-64">
              {NAVIGATION_DATA.map(({ href, title, description }) => {
                return (
                  title !== "Atendimentos" && (
                    <ListItem key={href} href={href} title={title}>
                      {description}
                    </ListItem>
                  )
                );
              })}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/atendimento">Atendimentos</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function ListItem({ title, children, href, ...props }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="flex flex-col gap-1 text-sm">
            <div className="leading-none font-medium">{title}</div>
            <div className="text-muted-foreground line-clamp-2">{children}</div>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
