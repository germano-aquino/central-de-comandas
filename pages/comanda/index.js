"use client";

import { Header } from "@/components/Header";
import { OrderSummary } from "@/components/OrderSummary";
import { ServicesByCategory } from "@/components/ServicesByCategory";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import service from "@/models/service";
import category from "@/models/category";
import authorization from "@/models/authorization";
import session from "@/models/session";
import user from "@/models/user";
import { ForbiddenError } from "@/infra/errors";

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

export async function getServerSideProps(context) {
  async function findLoggedUser(request) {
    const userSession = await session.findOneValidByToken(
      request.cookies?.session_id,
    );
    const userRequesting = await user.findOneById(userSession.user_id);

    return userRequesting;
  }

  function checkUserFeatures(user, features) {
    features.forEach((feature) => {
      if (!authorization.can(user, "read:category"))
        throw new ForbiddenError({
          message: "O usuário não possui permissão para executar esta ação.",
          action: `Verifique se o usuário possui a feature "${feature}".`,
        });
    });
  }

  function dateToISOString(objects) {
    const newObjects = objects.map((obj) => {
      return {
        ...obj,
        updated_at: obj.updated_at.toISOString(),
        created_at: obj.created_at.toISOString(),
      };
    });
    return newObjects;
  }

  async function getCategoriesAndServices() {
    let categories = await category.retrieveAll();
    categories = dateToISOString(categories);

    let services = await service.retrieveAll();
    services = dateToISOString(services);

    return [categories, services];
  }

  try {
    const { req } = context;
    const userRequesting = await findLoggedUser(req);

    checkUserFeatures(userRequesting, ["read:category", "read:service"]);

    const [categories, services] = await getCategoriesAndServices();

    return {
      props: {
        categories,
        services,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
}

export default Command;
