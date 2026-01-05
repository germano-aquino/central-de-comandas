import orchestrator from "tests/orchestrator";

import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/form/sections", () => {
  describe("Default user", () => {
    test("With valid data and without permission", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const response = await fetch(
        "http://localhost:3000/api/v1/form/sections",
        {
          method: "POST",
          headers: {
            Cookie: `session_id=${userSession.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            name: "NewFormSection",
          }),
        },
      );

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "O usuário não possui permissão para executar esta ação.",
        action:
          'Verifique se o usuário possui a feature "create:form_section".',
        status_code: 403,
      });
    });

    test("With permission and valid data", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.addFormSectionsFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const response = await fetch(
        "http://localhost:3000/api/v1/form/sections",
        {
          method: "POST",
          headers: {
            Cookie: `session_id=${userSession.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            name: "NewFormSection",
          }),
        },
      );

      expect(response.status).toBe(201);

      const responseBody = await response.json();

      expect(responseBody.name).toBe("NewFormSection");
      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });

    test("With permission and duplicated form section name", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.addCategoriesFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const response = await fetch(
        "http://localhost:3000/api/v1/form/sections",
        {
          method: "POST",
          headers: {
            Cookie: `session_id=${userSession.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            name: "newformsection",
          }),
        },
      );

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Este nome já está sendo utilizado.",
        action: "Escolha um novo nome e tente novamente.",
        status_code: 400,
      });
    });
  });

  describe("Anonymous user", () => {
    test("With valid data", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/form/sections",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            name: "NewFormSection",
          }),
        },
      );

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "O usuário não possui permissão para executar esta ação.",
        action:
          'Verifique se o usuário possui a feature "create:form_section".',
        status_code: 403,
      });
    });
  });
});
