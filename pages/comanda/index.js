"use client";

import { Header } from "@/components/Header";
import { OrderSummary } from "@/components/OrderSummary";
import { ServicesByCategory } from "@/components/ServicesByCategory";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import orchestrator from "@/tests/orchestrator";
import { useState } from "react";

function Command({ categories, services }) {
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
      setOrder([...order, { ...item, quantity: 1, price: item.price / 100 }]);
    }

    setSelectedServices(newSelected);
  }

  function clearOrder() {
    setOrder([]);
    setSelectedServices(new Set());
    setClientName("");
    setPaymentMethod("");
  }

  const servicesByCategory = categories.map((category) => ({
    category: category.name,
    services: services.filter((item) => item.category_id === category.id),
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
            {/* Services by Category container */}
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

export async function getServerSideProps() {
  const inactiveUser = await orchestrator.createUser();
  const activeUser = await orchestrator.activateUser(inactiveUser);
  await orchestrator.addCategoriesFeatures(activeUser);
  await orchestrator.addServicesFeatures(activeUser);
  const session = await orchestrator.createSession(activeUser);
  const headers = {
    Cookie: `session_id=${session.token}`,
  };

  const categoriesResponse = await fetch(
    "http://localhost:3000/api/v1/categories",
    {
      headers,
    },
  );
  const categories = await categoriesResponse.json();

  const servicesResponse = await fetch(
    "http://localhost:3000/api/v1/services",
    {
      headers,
    },
  );
  const services = await servicesResponse.json();

  return {
    props: {
      categories,
      services,
    },
  };
}

export default Command;
