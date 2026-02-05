import { NotFoundError } from "infra/errors";
import store from "models/store";
import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("DELETE /api/v1/stores/[store_name]", () => {
  describe("Default user", () => {
    test("With valid data and without permission", async () => {
      const loggedUser = await orchestrator.createLoggedUser();

      const store = await orchestrator.createStore("OldName");

      const response = await fetch(
        `http://localhost:3000/api/v1/stores/${store.name}`,
        {
          method: "DELETE",
          headers: {
            Cookie: `session_id=${loggedUser.token}`,
          },
        },
      );

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "O usuário não possui permissão para executar esta ação.",
        action: 'Verifique se o usuário possui a feature "delete:store".',
        status_code: 403,
      });
    });

    test("With permission and valid data", async () => {
      const loggedUser = await orchestrator.createLoggedUser();
      await orchestrator.addStoreFeatures(loggedUser);

      const storeToBeDeleted = await orchestrator.createStore();

      const response = await fetch(
        `http://localhost:3000/api/v1/stores/${storeToBeDeleted.name}`,
        {
          method: "DELETE",
          headers: {
            Cookie: `session_id=${loggedUser.token}`,
          },
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: storeToBeDeleted.id,
        name: storeToBeDeleted.name,
        created_at: storeToBeDeleted.created_at.toISOString(),
        updated_at: storeToBeDeleted.updated_at.toISOString(),
      });

      //Verify that store doesn't exist on database

      await expect(
        store.findOneValidByName(storeToBeDeleted.name),
      ).rejects.toThrow(NotFoundError);
    });

    test("With permission and with different case", async () => {
      const loggedUser = await orchestrator.createLoggedUser();
      await orchestrator.addStoreFeatures(loggedUser);

      const storeToBeDeleted = await orchestrator.createStore("mismatchcase");

      const response = await fetch(
        `http://localhost:3000/api/v1/stores/MismatchCase`,
        {
          method: "DELETE",
          headers: {
            Cookie: `session_id=${loggedUser.token}`,
          },
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: storeToBeDeleted.id,
        name: "mismatchcase",
        created_at: storeToBeDeleted.created_at.toISOString(),
        updated_at: storeToBeDeleted.updated_at.toISOString(),
      });

      //Verify that store doesn't exist on database

      await expect(
        store.findOneValidByName(storeToBeDeleted.name),
      ).rejects.toThrow(NotFoundError);
    });

    test("With permission and nonexistent store name", async () => {
      const loggedUser = await orchestrator.createLoggedUser();
      await orchestrator.addStoreFeatures(loggedUser);

      const response = await fetch(
        `http://localhost:3000/api/v1/stores/NonexistentCategory`,
        {
          method: "DELETE",
          headers: {
            Cookie: `session_id=${loggedUser.token}`,
          },
        },
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "Não existe uma loja com esse nome.",
        action: "Confirme o nome da loja e tente novamente.",
        status_code: 404,
      });
    });
  });

  describe("Anonymous user", () => {
    test("With valid data", async () => {
      const store = await orchestrator.createSection();

      const response = await fetch(
        `http://localhost:3000/api/v1/stores/${store.name}`,
        {
          method: "DELETE",
        },
      );

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "O usuário não possui permissão para executar esta ação.",
        action: 'Verifique se o usuário possui a feature "delete:store".',
        status_code: 403,
      });
    });
  });
});
