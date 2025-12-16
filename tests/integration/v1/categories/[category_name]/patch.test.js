import orchestrator from "tests/orchestrator";

import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("PATCH /api/v1/categories/[category_name]", () => {
  describe("Default user", () => {
    test("With valid data and without permission", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const category = await orchestrator.createCategory("OldName");

      const response = await fetch(
        `http://localhost:3000/api/v1/categories/${category.name}`,
        {
          method: "PATCH",
          headers: {
            Cookie: `session_id=${userSession.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            name: "NewName",
          }),
        },
      );

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "O usuário não possui permissão para executar esta ação.",
        action: 'Verifique se o usuário possui a feature "edit:category".',
        status_code: 403,
      });
    });

    test("With permission and valid data", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.setCategoriesFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const category = await orchestrator.createCategory();

      const response = await fetch(
        `http://localhost:3000/api/v1/categories/${category.name}`,
        {
          method: "PATCH",
          headers: {
            Cookie: `session_id=${userSession.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            name: "Update Name",
          }),
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody.name).toBe("Update Name");
      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      expect(Date.parse(responseBody.created_at)).toBeLessThan(
        Date.parse(responseBody.updated_at),
      );
    });

    test("With permission and with different case", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.setCategoriesFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const category = await orchestrator.createCategory("mismatchcase");

      const response = await fetch(
        `http://localhost:3000/api/v1/categories/${category.name}`,
        {
          method: "PATCH",
          headers: {
            Cookie: `session_id=${userSession.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            name: "misMatchCase",
          }),
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: category.id,
        name: "misMatchCase",
        created_at: category.created_at.toISOString(),
        updated_at: responseBody.updated_at,
      });

      expect(Date.parse(responseBody.created_at)).toBeLessThan(
        Date.parse(responseBody.updated_at),
      );
    });

    test("With permission and nonexistent category name", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.setCategoriesFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const response = await fetch(
        `http://localhost:3000/api/v1/categories/NonexistentCategory`,
        {
          method: "PATCH",
          headers: {
            Cookie: `session_id=${userSession.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            name: "Update Name",
          }),
        },
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "Esta categoria não existe.",
        action: "Verifique o nome da categoria e tente novamente.",
        status_code: 404,
      });
    });
  });

  describe("Anonymous user", () => {
    test("With valid data", async () => {
      const category = await orchestrator.createCategory();

      const response = await fetch(
        `http://localhost:3000/api/v1/categories/${category.name}`,
        {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            name: "othername",
          }),
        },
      );

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "O usuário não possui permissão para executar esta ação.",
        action: 'Verifique se o usuário possui a feature "edit:category".',
        status_code: 403,
      });
    });
  });
});
