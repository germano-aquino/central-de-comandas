import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/services", () => {
  describe("Default user", () => {
    test("Without permission", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const response = await fetch("http://localhost:3000/api/v1/services", {
        headers: {
          Cookie: `session_id=${userSession.token}`,
        },
      });

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "O usuário não possui permissão para executar esta ação.",
        action: 'Verifique se o usuário possui a feature "read:service".',
        status_code: 403,
      });
    });

    test("With permission and without category filtering", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.addServicesFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      let services = await orchestrator.createServices(7);
      services = services.map((service) => {
        return {
          ...service,
          created_at: service.created_at.toISOString(),
          updated_at: service.updated_at.toISOString(),
        };
      });

      const response = await fetch("http://localhost:3000/api/v1/services", {
        headers: {
          Cookie: `session_id=${userSession.token}`,
        },
      });

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual(services);
    });

    test("With permission and with category filtering", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.addServicesFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const categories = await orchestrator.createSections(3);

      let selectedServices = await orchestrator.createServices(7, {
        category_id: categories[0].id,
      });
      selectedServices = selectedServices.map((service) => {
        return {
          ...service,
          created_at: service.created_at.toISOString(),
          updated_at: service.updated_at.toISOString(),
        };
      });
      await orchestrator.createServices(5, { category_id: categories[1].id });
      await orchestrator.createServices(3, { category_id: categories[2].id });

      const params = new URLSearchParams();
      params.append("category_name", categories[0].name);

      const response = await fetch(
        `http://localhost:3000/api/v1/services?${params}`,
        {
          headers: {
            Cookie: `session_id=${userSession.token}`,
          },
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual(selectedServices);
    });
  });

  describe("Anonymous user", () => {
    test("With valid data", async () => {
      const response = await fetch("http://localhost:3000/api/v1/services");

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "O usuário não possui permissão para executar esta ação.",
        action: 'Verifique se o usuário possui a feature "read:service".',
        status_code: 403,
      });
    });
  });
});
