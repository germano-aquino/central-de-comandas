import { NotFoundError } from "infra/errors";
import category from "models/category";
import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("DELETE /api/v1/categories", () => {
  describe("Default user", () => {
    test("Without permission", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      const userSession = await orchestrator.createSession(activatedUser);

      let categories = await orchestrator.createCategories(7);
      const categoryIds = categories.map((category) => category.id);

      const response = await fetch("http://localhost:3000/api/v1/categories", {
        method: "DELETE",
        headers: {
          Cookie: `session_id=${userSession.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          category_ids: categoryIds,
        }),
      });

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

      let categories = await orchestrator.createCategories(7);
      categories = categories.map((category) => {
        return {
          ...category,
          created_at: category.created_at.toISOString(),
          updated_at: category.updated_at.toISOString(),
        };
      });
      const categoryIds = categories.map((category) => category.id);

      const response = await fetch("http://localhost:3000/api/v1/categories", {
        method: "DELETE",
        headers: {
          Cookie: `session_id=${userSession.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          category_ids: categoryIds,
        }),
      });

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual(categories);

      //Verify that category doesn't exist on database

      categories.map(async (deletedCategory) => {
        await expect(
          category.findOneValidByName(deletedCategory.name),
        ).rejects.toThrow(NotFoundError);
      });
    });

    test("With permission and nonexistent category ids", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.setCategoriesFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const response = await fetch(`http://localhost:3000/api/v1/categories`, {
        method: "DELETE",
        headers: {
          Cookie: `session_id=${userSession.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          category_ids: [
            "cbd746a2-6090-4e1d-9f92-873fca25514d",
            "d110e555-ebf2-4acc-ad72-63739372f537",
            "8882cc13-74c3-4170-9420-04077d68c7df",
            "1e806612-ddac-4241-8ae7-cdbabd306b3c",
          ],
        }),
      });

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual([]);
    });
  });

  describe("Anonymous user", () => {
    test("With valid data", async () => {
      const categories = await orchestrator.createCategories(7);
      const categoryIds = categories.map((category) => category.id);

      const response = await fetch("http://localhost:3000/api/v1/categories", {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          category_ids: categoryIds,
        }),
      });

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
