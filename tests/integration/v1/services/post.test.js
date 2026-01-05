import orchestrator from "tests/orchestrator";

import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/services", () => {
  describe("Default user", () => {
    test("With valid data and without permission", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const response = await fetch("http://localhost:3000/api/v1/services", {
        method: "POST",
        headers: {
          Cookie: `session_id=${userSession.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name: "NewService",
          price: 9999,
        }),
      });

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "O usuário não possui permissão para executar esta ação.",
        action: 'Verifique se o usuário possui a feature "create:service".',
        status_code: 403,
      });
    });

    test("With permission, valid data and without category", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.addServicesFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const response = await fetch("http://localhost:3000/api/v1/services", {
        method: "POST",
        headers: {
          Cookie: `session_id=${userSession.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name: "NewService",
          price: 9999,
        }),
      });

      expect(response.status).toBe(201);

      const responseBody = await response.json();

      expect(responseBody.name).toBe("NewService");
      expect(responseBody.price).toBe(9999);
      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });

    test("With permission, valid data and with category", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.addServicesFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const serviceCategory =
        await orchestrator.createCategory("Brazilian Waxing");

      const response = await fetch("http://localhost:3000/api/v1/services", {
        method: "POST",
        headers: {
          Cookie: `session_id=${userSession.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name: "Bikini Waxing",
          price: 9999,
          category_id: serviceCategory.id,
        }),
      });

      expect(response.status).toBe(201);

      const responseBody = await response.json();

      expect(responseBody.name).toBe("Bikini Waxing");
      expect(responseBody.price).toBe(9999);
      expect(responseBody.category_id).toBe(serviceCategory.id);
      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });

    test("With permission, valid data and nonexistent category", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.addServicesFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const response = await fetch("http://localhost:3000/api/v1/services", {
        method: "POST",
        headers: {
          Cookie: `session_id=${userSession.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name: "NewService",
          price: 9999,
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

    test("With permission and duplicated service name", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.addServicesFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const response = await fetch("http://localhost:3000/api/v1/services", {
        method: "POST",
        headers: {
          Cookie: `session_id=${userSession.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name: "newservice",
          price: 5050,
        }),
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Já existe um serviço com esse nome.",
        action: "Escolha um novo nome para o serviço e tente novamente.",
        status_code: 400,
      });
    });
  });

  describe("Anonymous user", () => {
    test("With valid data", async () => {
      const response = await fetch("http://localhost:3000/api/v1/services", {
        method: "POST",
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
        action: 'Verifique se o usuário possui a feature "create:service".',
        status_code: 403,
      });
    });
  });
});
