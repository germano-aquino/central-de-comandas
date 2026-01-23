"use client";

import { Header } from "@/components/Header";
import { OrderSummary } from "@/components/OrderSummary";
import { ServicesByCategory } from "@/components/ServicesByCategory";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const MENU_ITEMS = [
  // Depilação
  {
    id: "d1",
    name: "Abdomen Completa",
    description: "Depilação completa da região abdominal",
    price: 45.0,
    category: "Depilação",
    image:
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400&h=300&fit=crop",
  },
  {
    id: "d2",
    name: "Antebraços",
    description: "Depilação dos antebraços",
    price: 35.0,
    category: "Depilação",
    image:
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400&h=300&fit=crop",
  },
  {
    id: "d3",
    name: "Aréola",
    description: "Depilação da região da aréola",
    price: 25.0,
    category: "Depilação",
    image:
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400&h=300&fit=crop",
  },
  {
    id: "d4",
    name: "Axilas",
    description: "Depilação das axilas",
    price: 30.0,
    category: "Depilação",
    image:
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400&h=300&fit=crop",
  },
  {
    id: "d5",
    name: "Braços Completos",
    description: "Depilação completa dos braços",
    price: 50.0,
    category: "Depilação",
    image:
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400&h=300&fit=crop",
  },
  {
    id: "d6",
    name: "Buço",
    description: "Depilação do buço",
    price: 20.0,
    category: "Depilação",
    image:
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400&h=300&fit=crop",
  },
  {
    id: "d7",
    name: "Coccix",
    description: "Depilação da região do coccix",
    price: 30.0,
    category: "Depilação",
    image:
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400&h=300&fit=crop",
  },
  {
    id: "d8",
    name: "Costas",
    description: "Depilação das costas",
    price: 60.0,
    category: "Depilação",
    image:
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400&h=300&fit=crop",
  },
  {
    id: "d9",
    name: "Costas Completas",
    description: "Depilação completa das costas",
    price: 80.0,
    category: "Depilação",
    image:
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400&h=300&fit=crop",
  },
  {
    id: "d10",
    name: "Costas Dorsal",
    description: "Depilação da região dorsal",
    price: 45.0,
    category: "Depilação",
    image:
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400&h=300&fit=crop",
  },
  {
    id: "d11",
    name: "Costas Lombar",
    description: "Depilação da região lombar",
    price: 45.0,
    category: "Depilação",
    image:
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400&h=300&fit=crop",
  },
  {
    id: "d12",
    name: "Costelas",
    description: "Depilação da região das costelas",
    price: 35.0,
    category: "Depilação",
    image:
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400&h=300&fit=crop",
  },
  {
    id: "d13",
    name: "Coxa Anterior",
    description: "Depilação da parte anterior da coxa",
    price: 45.0,
    category: "Depilação",
    image:
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400&h=300&fit=crop",
  },
  {
    id: "d14",
    name: "Coxa Posterior",
    description: "Depilação da parte posterior da coxa",
    price: 45.0,
    category: "Depilação",
    image:
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400&h=300&fit=crop",
  },
  {
    id: "d15",
    name: "Coxas Completas",
    description: "Depilação completa das coxas",
    price: 75.0,
    category: "Depilação",
    image:
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400&h=300&fit=crop",
  },
  {
    id: "d16",
    name: "Entre Seios",
    description: "Depilação entre os seios",
    price: 25.0,
    category: "Depilação",
    image:
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400&h=300&fit=crop",
  },
  {
    id: "d17",
    name: "Faixa de Coxa",
    description: "Depilação em faixa na coxa",
    price: 35.0,
    category: "Depilação",
    image:
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400&h=300&fit=crop",
  },
  {
    id: "d18",
    name: "Faixa de Nádegas",
    description: "Depilação em faixa nas nádegas",
    price: 35.0,
    category: "Depilação",
    image:
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400&h=300&fit=crop",
  },
  {
    id: "d19",
    name: "Linha Alba Inferior",
    description: "Depilação da linha alba inferior",
    price: 25.0,
    category: "Depilação",
    image:
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400&h=300&fit=crop",
  },
  {
    id: "d20",
    name: "Linha Alba Superior",
    description: "Depilação da linha alba superior",
    price: 25.0,
    category: "Depilação",
    image:
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400&h=300&fit=crop",
  },
  {
    id: "d21",
    name: "Mãos",
    description: "Depilação das mãos",
    price: 20.0,
    category: "Depilação",
    image:
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400&h=300&fit=crop",
  },
  {
    id: "d22",
    name: "Meia Perna",
    description: "Depilação de meia perna",
    price: 50.0,
    category: "Depilação",
    image:
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400&h=300&fit=crop",
  },
  {
    id: "d23",
    name: "Nádegas",
    description: "Depilação das nádegas",
    price: 40.0,
    category: "Depilação",
    image:
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400&h=300&fit=crop",
  },
  {
    id: "d24",
    name: "Nariz",
    description: "Depilação do nariz",
    price: 20.0,
    category: "Depilação",
    image:
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400&h=300&fit=crop",
  },
  {
    id: "d25",
    name: "Nuca",
    description: "Depilação da nuca",
    price: 25.0,
    category: "Depilação",
    image:
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400&h=300&fit=crop",
  },
  {
    id: "d26",
    name: "Ombros",
    description: "Depilação dos ombros",
    price: 35.0,
    category: "Depilação",
    image:
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400&h=300&fit=crop",
  },
  {
    id: "d27",
    name: "Orelha",
    description: "Depilação da orelha",
    price: 20.0,
    category: "Depilação",
    image:
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400&h=300&fit=crop",
  },
  {
    id: "d28",
    name: "Perianal",
    description: "Depilação perianal",
    price: 35.0,
    category: "Depilação",
    image:
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400&h=300&fit=crop",
  },
  {
    id: "d29",
    name: "Perna Inteira",
    description: "Depilação da perna inteira",
    price: 80.0,
    category: "Depilação",
    image:
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400&h=300&fit=crop",
  },
  {
    id: "d30",
    name: "Pés",
    description: "Depilação dos pés",
    price: 20.0,
    category: "Depilação",
    image:
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400&h=300&fit=crop",
  },
  {
    id: "d31",
    name: "Pescoço",
    description: "Depilação do pescoço",
    price: 25.0,
    category: "Depilação",
    image:
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400&h=300&fit=crop",
  },
  {
    id: "d32",
    name: "Queixo",
    description: "Depilação do queixo",
    price: 20.0,
    category: "Depilação",
    image:
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400&h=300&fit=crop",
  },
  {
    id: "d33",
    name: "Seios",
    description: "Depilação dos seios",
    price: 30.0,
    category: "Depilação",
    image:
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400&h=300&fit=crop",
  },
  {
    id: "d34",
    name: "Têmporas",
    description: "Depilação das têmporas",
    price: 20.0,
    category: "Depilação",
    image:
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400&h=300&fit=crop",
  },
  {
    id: "d35",
    name: "Testa",
    description: "Depilação da testa",
    price: 20.0,
    category: "Depilação",
    image:
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400&h=300&fit=crop",
  },
  {
    id: "d36",
    name: "Umbigo",
    description: "Depilação ao redor do umbigo",
    price: 20.0,
    category: "Depilação",
    image:
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400&h=300&fit=crop",
  },
  {
    id: "d37",
    name: "Virilha Biquíni",
    description: "Depilação virilha biquíni",
    price: 40.0,
    category: "Depilação",
    image:
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400&h=300&fit=crop",
  },
  {
    id: "d38",
    name: "Virilha Cavada",
    description: "Depilação virilha cavada",
    price: 45.0,
    category: "Depilação",
    image:
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400&h=300&fit=crop",
  },
  {
    id: "d39",
    name: "Virilha Íntima",
    description: "Depilação íntima completa",
    price: 50.0,
    category: "Depilação",
    image:
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400&h=300&fit=crop",
  },
  {
    id: "d40",
    name: "Virilha Íntima + Perianal",
    description: "Depilação íntima com perianal",
    price: 70.0,
    category: "Depilação",
    image:
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400&h=300&fit=crop",
  },

  // Depilação a Linha
  {
    id: "dl1",
    name: "Buço na Linha",
    description: "Depilação a linha do buço",
    price: 25.0,
    category: "Depilação a Linha",
    image:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=300&fit=crop",
  },
  {
    id: "dl2",
    name: "Pescoço na Linha",
    description: "Depilação a linha do pescoço",
    price: 30.0,
    category: "Depilação a Linha",
    image:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=300&fit=crop",
  },
  {
    id: "dl3",
    name: "Têmporas a Linha",
    description: "Depilação a linha das têmporas",
    price: 25.0,
    category: "Depilação a Linha",
    image:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=300&fit=crop",
  },
  {
    id: "dl4",
    name: "Face Completa",
    description: "Depilação a linha facial completa",
    price: 60.0,
    category: "Depilação a Linha",
    image:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=300&fit=crop",
  },
  {
    id: "dl5",
    name: "Queixo na Linha",
    description: "Depilação a linha do queixo",
    price: 25.0,
    category: "Depilação a Linha",
    image:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=300&fit=crop",
  },
  {
    id: "dl6",
    name: "Testa na Linha",
    description: "Depilação a linha da testa",
    price: 25.0,
    category: "Depilação a Linha",
    image:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=300&fit=crop",
  },

  // Estética Facial
  {
    id: "ef1",
    name: "Design",
    description: "Design de sobrancelhas",
    price: 35.0,
    category: "Estética Facial",
    image:
      "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=300&fit=crop",
  },
  {
    id: "ef2",
    name: "Design + Buço",
    description: "Design de sobrancelhas com buço",
    price: 50.0,
    category: "Estética Facial",
    image:
      "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=300&fit=crop",
  },
  {
    id: "ef3",
    name: "Design + Henna",
    description: "Design com aplicação de henna",
    price: 55.0,
    category: "Estética Facial",
    image:
      "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=300&fit=crop",
  },
  {
    id: "ef4",
    name: "Design + Coloração",
    description: "Design com coloração",
    price: 60.0,
    category: "Estética Facial",
    image:
      "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=300&fit=crop",
  },
  {
    id: "ef5",
    name: "Henna",
    description: "Aplicação de henna",
    price: 30.0,
    category: "Estética Facial",
    image:
      "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=300&fit=crop",
  },
  {
    id: "ef6",
    name: "Coloração",
    description: "Coloração de sobrancelhas",
    price: 35.0,
    category: "Estética Facial",
    image:
      "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=300&fit=crop",
  },
  {
    id: "ef7",
    name: "Design + Henna + Buço",
    description: "Design completo com henna e buço",
    price: 70.0,
    category: "Estética Facial",
    image:
      "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=300&fit=crop",
  },
  {
    id: "ef8",
    name: "Design + Coloração + Buço",
    description: "Design completo com coloração e buço",
    price: 75.0,
    category: "Estética Facial",
    image:
      "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=300&fit=crop",
  },
  {
    id: "ef9",
    name: "Spa Labial",
    description: "Tratamento hidratante labial",
    price: 45.0,
    category: "Estética Facial",
    image:
      "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=300&fit=crop",
  },
  {
    id: "ef10",
    name: "Limpeza de Pele Profunda",
    description: "Limpeza profunda da pele",
    price: 120.0,
    category: "Estética Facial",
    image:
      "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=300&fit=crop",
  },
  {
    id: "ef11",
    name: "Limpeza de Pele Especial",
    description: "Limpeza especial com tratamentos",
    price: 150.0,
    category: "Estética Facial",
    image:
      "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=300&fit=crop",
  },
  {
    id: "ef12",
    name: "Hidratação Facial",
    description: "Hidratação profunda facial",
    price: 90.0,
    category: "Estética Facial",
    image:
      "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=300&fit=crop",
  },
  {
    id: "ef13",
    name: "Detox Facial",
    description: "Tratamento detox para a pele",
    price: 100.0,
    category: "Estética Facial",
    image:
      "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=300&fit=crop",
  },

  // Estética Corporal
  {
    id: "ec1",
    name: "Massagem Relaxante",
    description: "Massagem relaxante corporal",
    price: 100.0,
    category: "Estética Corporal",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
  },
  {
    id: "ec2",
    name: "Massagem Modeladora",
    description: "Massagem modeladora para contorno",
    price: 120.0,
    category: "Estética Corporal",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
  },
  {
    id: "ec3",
    name: "Drenagem Linfática",
    description: "Drenagem linfática manual",
    price: 110.0,
    category: "Estética Corporal",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
  },

  // Esmalteria
  {
    id: "es1",
    name: "Manicure + Pedicure",
    description: "Manicure e pedicure completos",
    price: 60.0,
    category: "Esmalteria",
    image:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop",
  },
  {
    id: "es2",
    name: "Manicure Brasileirinha",
    description: "Manicure brasileirinha",
    price: 35.0,
    category: "Esmalteria",
    image:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop",
  },
  {
    id: "es3",
    name: "Pedicure Brasileirinha",
    description: "Pedicure brasileirinha",
    price: 40.0,
    category: "Esmalteria",
    image:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop",
  },
  {
    id: "es4",
    name: "Argila Verde",
    description: "Tratamento com argila verde",
    price: 50.0,
    category: "Esmalteria",
    image:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop",
  },
  {
    id: "es5",
    name: "Manicure Ligeirinha",
    description: "Manicure rápida",
    price: 25.0,
    category: "Esmalteria",
    image:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop",
  },
  {
    id: "es6",
    name: "Pedicure Ligeirinha",
    description: "Pedicure rápida",
    price: 30.0,
    category: "Esmalteria",
    image:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop",
  },
  {
    id: "es7",
    name: "Spa dos Pés",
    description: "Spa relaxante para os pés",
    price: 70.0,
    category: "Esmalteria",
    image:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop",
  },
  {
    id: "es8",
    name: "Infantil",
    description: "Manicure e pedicure infantil",
    price: 35.0,
    category: "Esmalteria",
    image:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop",
  },
  {
    id: "es9",
    name: "Francesinha",
    description: "Unha francesinha",
    price: 15.0,
    category: "Esmalteria",
    image:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop",
  },
  {
    id: "es10",
    name: "Unha Postiça",
    description: "Aplicação de unha postiça",
    price: 80.0,
    category: "Esmalteria",
    image:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop",
  },
  {
    id: "es11",
    name: "Reparo",
    description: "Reparo de unha",
    price: 10.0,
    category: "Esmalteria",
    image:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop",
  },
];

function Command() {
  const [clientName, setClientName] = useState("");
  const [selectedServices, setSelectedServices] = useState(new Set());
  const [order, setOrder] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");

  function toggleService(item) {
    const newSelected = new Set(selectedServices);

    if (selectedServices.has(item.id)) {
      // Remove do conjunto de selecionados e da comanda
      newSelected.delete(item.id);
      setOrder(order.filter((orderItem) => orderItem.id !== item.id));
    } else {
      // Adiciona ao conjunto de selecionados e à comanda
      newSelected.add(item.id);
      setOrder([...order, { ...item, quantity: 1 }]);
    }

    setSelectedServices(newSelected);
  }

  function clearOrder() {
    setOrder([]);
    setSelectedServices(new Set());
    setClientName("");
    setPaymentMethod("");
  }

  const categories = Array.from(
    new Set(MENU_ITEMS.map((item) => item.category)),
  );
  const servicesByCategory = categories.map((category) => ({
    category,
    services: MENU_ITEMS.filter((item) => item.category === category),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Service Container */}
          <div className="lg:col-span-2 space-y-6">
            {/* Client Container */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Label>Nome da cliente</Label>
              <Input
                id="clientName"
                placeholder="Digite o nome da cliente"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="mt-2"
              />
            </div>
            {/*Services by Category container */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="mb-4">Serviços Disponíveis</h2>
              <ServicesByCategory
                servicesByCategory={servicesByCategory}
                selectedServices={selectedServices}
                toggleService={toggleService}
              />
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="lg:col-span-1">
            <OrderSummary
              order={order}
              clientName={clientName}
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
              onClear={clearOrder}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Command;
