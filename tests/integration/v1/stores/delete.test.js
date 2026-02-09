import { NotFoundError } from "infra/errors";
import store from "models/store";
import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("DELETE /api/v1/stores", () => {
  describe("Default user", () => {
    test("Without permission", async () => {
      const loggedUser = await orchestrator.createLoggedUser();

      let stores = await orchestrator.createStores(7);
      const storeIds = stores.map((store) => store.id);

      const response = await fetch("http://localhost:3000/api/v1/stores", {
        method: "DELETE",
        headers: {
          Cookie: `session_id=${loggedUser.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          store_ids: storeIds,
        }),
      });

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

      let stores = await orchestrator.createStores(7);
      stores = stores.map((store) => {
        return {
          ...store,
          created_at: store.created_at.toISOString(),
          updated_at: store.updated_at.toISOString(),
        };
      });
      const storeIds = stores.map((store) => store.id);

      const response = await fetch("http://localhost:3000/api/v1/stores", {
        method: "DELETE",
        headers: {
          Cookie: `session_id=${loggedUser.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          store_ids: storeIds,
        }),
      });

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual(stores);

      //Verify that store doesn't exist on database

      stores.map(async (deletedStore) => {
        await expect(
          store.findOneValidByName(deletedStore.name),
        ).rejects.toThrow(NotFoundError);
      });
    });

    test("With permission and nonexistent store ids", async () => {
      const loggedUser = await orchestrator.createLoggedUser();
      await orchestrator.addStoreFeatures(loggedUser);

      const response = await fetch(`http://localhost:3000/api/v1/stores`, {
        method: "DELETE",
        headers: {
          Cookie: `session_id=${loggedUser.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          store_ids: [
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
      const stores = await orchestrator.createSections(7);
      const storeIds = stores.map((store) => store.id);

      const response = await fetch("http://localhost:3000/api/v1/stores", {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          store_ids: storeIds,
        }),
      });

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
