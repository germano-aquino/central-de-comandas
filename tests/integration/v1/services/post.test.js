import service from "@/models/service";
import orchestrator from "tests/orchestrator";

import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/services", () => {
  describe("Default user", () => {
    test("With valid data", async () => {
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
  });

  describe("Allowed user", () => {
    test("With name", async () => {
      const loggedUser = await orchestrator.createLoggedUser();
      await orchestrator.addFeatures(loggedUser, service.addFeatures);

      const response = await fetch("http://localhost:3000/api/v1/services", {
        method: "POST",
        headers: {
          Cookie: `session_id=${loggedUser.token}`,
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

    test("With category", async () => {
      const loggedUser = await orchestrator.createLoggedUser();
      await orchestrator.addFeatures(loggedUser, service.addFeatures);

      const serviceCategory =
        await orchestrator.createSection("Brazilian Waxing");

      const response = await fetch("http://localhost:3000/api/v1/services", {
        method: "POST",
        headers: {
          Cookie: `session_id=${loggedUser.token}`,
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

    test("With invalid is mold type", async () => {
      const loggedUser = await orchestrator.createLoggedUser();
      await orchestrator.addFeatures(loggedUser, service.addFeatures);

      const response = await fetch("http://localhost:3000/api/v1/services", {
        method: "POST",
        headers: {
          Cookie: `session_id=${loggedUser.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name: "Invalid is_mold type",
          price: 9999,
          is_mold: "esc",
        }),
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "O tipo da propriedade is_mold é inválido.",
        action:
          "Modifique a propriedade is_mold para um booleano e tente novamente.",
        status_code: 400,
      });
    });

    test("With is mold active", async () => {
      const loggedUser = await orchestrator.createLoggedUser();
      await orchestrator.addFeatures(loggedUser, service.addFeatures);

      const response = await fetch("http://localhost:3000/api/v1/services", {
        method: "POST",
        headers: {
          Cookie: `session_id=${loggedUser.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name: "Peri anal waxing",
          price: 9999,
          is_mold: true,
        }),
      });

      expect(response.status).toBe(201);

      const responseBody = await response.json();

      expect(responseBody.name).toBe("Peri anal waxing");
      expect(responseBody.price).toBe(9999);
      expect(responseBody.is_mold).toBe(true);
      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });

    test("With is mold active and category", async () => {
      const loggedUser = await orchestrator.createLoggedUser();
      await orchestrator.addFeatures(loggedUser, service.addFeatures);

      const category = await orchestrator.createSection();

      const response = await fetch("http://localhost:3000/api/v1/services", {
        method: "POST",
        headers: {
          Cookie: `session_id=${loggedUser.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name: "With is mold and category properties.",
          category_id: category.id,
          price: 9999,
          is_mold: true,
        }),
      });

      expect(response.status).toBe(201);

      const responseBody = await response.json();

      expect(responseBody.name).toBe("With is mold and category properties.");
      expect(responseBody.price).toBe(9999);
      expect(responseBody.category_id).toBe(category.id);
      expect(responseBody.is_mold).toBe(true);
      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });

    test("With nonexistent category", async () => {
      const loggedUser = await orchestrator.createLoggedUser();
      await orchestrator.addFeatures(loggedUser, service.addFeatures);

      const response = await fetch("http://localhost:3000/api/v1/services", {
        method: "POST",
        headers: {
          Cookie: `session_id=${loggedUser.token}`,
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

    test("With duplicated service name", async () => {
      const loggedUser = await orchestrator.createLoggedUser();
      await orchestrator.addFeatures(loggedUser, service.addFeatures);

      const response = await fetch("http://localhost:3000/api/v1/services", {
        method: "POST",
        headers: {
          Cookie: `session_id=${loggedUser.token}`,
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

    test("With missing price", async () => {
      const loggedUser = await orchestrator.createLoggedUser();
      await orchestrator.addFeatures(loggedUser, service.addFeatures);

      const response = await fetch("http://localhost:3000/api/v1/services", {
        method: "POST",
        headers: {
          Cookie: `session_id=${loggedUser.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name: "Missing price property.",
        }),
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "A propriedade price está ausente.",
        action:
          "Envie uma propriedade price com o preço do serviço em centavos.",
        status_code: 400,
      });
    });

    test("With price as a string", async () => {
      const loggedUser = await orchestrator.createLoggedUser();
      await orchestrator.addFeatures(loggedUser, service.addFeatures);

      const response = await fetch("http://localhost:3000/api/v1/services", {
        method: "POST",
        headers: {
          Cookie: `session_id=${loggedUser.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name: "Price as string.",
          price: "fifty cents",
        }),
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "A propriedade price deve ser um número inteiro positivo.",
        action:
          "Envie uma propriedade price com o preço do serviço em centavos.",
        status_code: 400,
      });
    });

    test("With price as a decimal", async () => {
      const loggedUser = await orchestrator.createLoggedUser();
      await orchestrator.addFeatures(loggedUser, service.addFeatures);

      const response = await fetch("http://localhost:3000/api/v1/services", {
        method: "POST",
        headers: {
          Cookie: `session_id=${loggedUser.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name: "Price as decimal.",
          price: 54.5,
        }),
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "A propriedade price deve ser um número inteiro positivo.",
        action:
          "Envie uma propriedade price com o preço do serviço em centavos.",
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
