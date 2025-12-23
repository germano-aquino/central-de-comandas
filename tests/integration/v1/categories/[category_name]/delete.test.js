import { NotFoundError } from "infra/errors";
import category from "models/category";
import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("DELETE /api/v1/categories/[category_name]", () => {
  describe("Default user", () => {
    test("With valid data and without permission", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const category = await orchestrator.createCategory("OldName");

      const response = await fetch(
        `http://localhost:3000/api/v1/categories/${category.name}`,
        {
          method: "DELETE",
          headers: {
            Cookie: `session_id=${userSession.token}`,
          },
        },
      );

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "O usuário não possui permissão para executar esta ação.",
        action: 'Verifique se o usuário possui a feature "delete:category".',
        status_code: 403,
      });
    });

    test("With permission and valid data", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.setCategoriesFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const categoryToBeDeleted = await orchestrator.createCategory();

      const response = await fetch(
        `http://localhost:3000/api/v1/categories/${categoryToBeDeleted.name}`,
        {
          method: "DELETE",
          headers: {
            Cookie: `session_id=${userSession.token}`,
          },
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: categoryToBeDeleted.id,
        name: categoryToBeDeleted.name,
        created_at: categoryToBeDeleted.created_at.toISOString(),
        updated_at: categoryToBeDeleted.updated_at.toISOString(),
      });

      //Verify that category doesn't exist on database

      await expect(
        category.findOneValidByName(categoryToBeDeleted.name),
      ).rejects.toThrow(NotFoundError);
    });

    test("With permission and with different case", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.setCategoriesFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const categoryToBeDeleted =
        await orchestrator.createCategory("mismatchcase");

      const response = await fetch(
        `http://localhost:3000/api/v1/categories/MismatchCase`,
        {
          method: "DELETE",
          headers: {
            Cookie: `session_id=${userSession.token}`,
          },
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: categoryToBeDeleted.id,
        name: "mismatchcase",
        created_at: categoryToBeDeleted.created_at.toISOString(),
        updated_at: categoryToBeDeleted.updated_at.toISOString(),
      });

      //Verify that category doesn't exist on database

      await expect(
        category.findOneValidByName(categoryToBeDeleted.name),
      ).rejects.toThrow(NotFoundError);
    });

    test("With permission and nonexistent category name", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.setCategoriesFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const response = await fetch(
        `http://localhost:3000/api/v1/categories/NonexistentCategory`,
        {
          method: "DELETE",
          headers: {
            Cookie: `session_id=${userSession.token}`,
          },
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
          method: "DELETE",
        },
      );

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "O usuário não possui permissão para executar esta ação.",
        action: 'Verifique se o usuário possui a feature "delete:category".',
        status_code: 403,
      });
    });
  });
});
