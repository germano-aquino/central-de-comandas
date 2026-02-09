import orchestrator from "tests/orchestrator";

import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/stores", () => {
  describe("Default user", () => {
    test("With valid data and without permission", async () => {
      const loggedUser = await orchestrator.createLoggedUser();

      const response = await fetch("http://localhost:3000/api/v1/stores", {
        method: "POST",
        headers: {
          Cookie: `session_id=${loggedUser.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name: "NewStore",
        }),
      });

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "O usuário não possui permissão para executar esta ação.",
        action: 'Verifique se o usuário possui a feature "create:store".',
        status_code: 403,
      });
    });

    test("With permission and valid data", async () => {
      const loggedUser = await orchestrator.createLoggedUser();
      await orchestrator.addStoreFeatures(loggedUser);

      const response = await fetch("http://localhost:3000/api/v1/stores", {
        method: "POST",
        headers: {
          Cookie: `session_id=${loggedUser.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name: "NewStore",
        }),
      });

      expect(response.status).toBe(201);

      const responseBody = await response.json();

      expect(responseBody.name).toBe("NewStore");
      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });

    test("With permission and duplicated store name", async () => {
      const loggedUser = await orchestrator.createLoggedUser();
      await orchestrator.addStoreFeatures(loggedUser);

      const response = await fetch("http://localhost:3000/api/v1/stores", {
        method: "POST",
        headers: {
          Cookie: `session_id=${loggedUser.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name: "newstore",
        }),
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Este nome de loja já está sendo utilizado.",
        action: "Escolha um novo nome para loja e tente novamente.",
        status_code: 400,
      });
    });
  });

  describe("Anonymous user", () => {
    test("With valid data", async () => {
      const response = await fetch("http://localhost:3000/api/v1/stores", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name: "newStore",
        }),
      });

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "O usuário não possui permissão para executar esta ação.",
        action: 'Verifique se o usuário possui a feature "create:store".',
        status_code: 403,
      });
    });
  });
});
