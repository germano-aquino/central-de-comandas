import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("PATCH /api/v1/services", () => {
  describe("Default user", () => {
    test("With valid data and without permission", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const services = await orchestrator.createServices(3);
      const serviceIds = services.map((service) => service.id);

      const response = await fetch("http://localhost:3000/api/v1/services", {
        method: "PATCH",
        headers: {
          Cookie: `session_id=${userSession.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          service_ids: serviceIds,
          price: 9999,
        }),
      });

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "O usuário não possui permissão para executar esta ação.",
        action: 'Verifique se o usuário possui a feature "edit:service".',
        status_code: 403,
      });
    });

    test("With permission and new price", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.addServicesFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const services = await orchestrator.createServices(3);
      const serviceIds = services.map((service) => service.id);

      const response = await fetch("http://localhost:3000/api/v1/services", {
        method: "PATCH",
        headers: {
          Cookie: `session_id=${userSession.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          service_ids: serviceIds,
          price: 9999,
        }),
      });

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      const servicesWithNewPrice = services.map((service) => {
        return {
          ...service,
          created_at: service.created_at.toISOString(),
          updated_at: responseBody[0].updated_at,
          price: 9999,
        };
      });

      expect(responseBody).toEqual(servicesWithNewPrice);

      expect(Date.parse(responseBody[0].updated_at)).toBeGreaterThan(
        Date.parse(responseBody[0].created_at),
      );
    });

    test("With permission and new category", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.addServicesFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const serviceCategory = await orchestrator.createSection("Brow Design");

      const services = await orchestrator.createServices(3);
      const serviceIds = services.map((service) => service.id);

      const response = await fetch("http://localhost:3000/api/v1/services", {
        method: "PATCH",
        headers: {
          Cookie: `session_id=${userSession.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          service_ids: serviceIds,
          category_id: serviceCategory.id,
        }),
      });

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      const servicesWithNewCategory = services.map((service) => {
        return {
          ...service,
          created_at: service.created_at.toISOString(),
          updated_at: responseBody[0].updated_at,
          category_id: serviceCategory.id,
        };
      });

      expect(responseBody).toEqual(servicesWithNewCategory);

      expect(Date.parse(responseBody[0].updated_at)).toBeGreaterThan(
        Date.parse(responseBody[0].created_at),
      );
    });

    test("With permission and nonexistent category", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.addServicesFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const services = await orchestrator.createServices(3);
      const serviceIds = services.map((service) => service.id);

      const response = await fetch("http://localhost:3000/api/v1/services", {
        method: "PATCH",
        headers: {
          Cookie: `session_id=${userSession.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          service_ids: serviceIds,
          category_id: "cbd746a2-6090-4e1d-9f92-873fca25514d",
        }),
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Esta seção não existe.",
        action: "Verifique o id da seção e tente novamente.",
        status_code: 400,
      });
    });

    test("With permission and new service name", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.addServicesFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const services = await orchestrator.createServices(3);
      const serviceIds = services.map((service) => service.id);

      const response = await fetch("http://localhost:3000/api/v1/services", {
        method: "PATCH",
        headers: {
          Cookie: `session_id=${userSession.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          service_ids: serviceIds,
          name: "newservice",
        }),
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message:
          "Não é possível editar o nome de múltiplos serviços com uma única requisição.",
        action: "Retire a propriedade nome da requisição e tente novamente.",
        status_code: 400,
      });
    });

    test("With permission and missing service ids array", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.addServicesFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const response = await fetch("http://localhost:3000/api/v1/services", {
        method: "PATCH",
        headers: {
          Cookie: `session_id=${userSession.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          price: 9999,
        }),
      });

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual([]);
    });
  });

  describe("Anonymous user", () => {
    test("With valid data", async () => {
      const response = await fetch("http://localhost:3000/api/v1/services", {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name: "UnallowedUser",
          price: 1010,
        }),
      });

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "O usuário não possui permissão para executar esta ação.",
        action: 'Verifique se o usuário possui a feature "edit:service".',
        status_code: 403,
      });
    });
  });
});
