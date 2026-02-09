import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/stores", () => {
  describe("Default user", () => {
    test("Without permission", async () => {
      const loggedUser = await orchestrator.createLoggedUser();

      const response = await fetch("http://localhost:3000/api/v1/stores", {
        headers: {
          Cookie: `session_id=${loggedUser.token}`,
        },
      });

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "O usuário não possui permissão para executar esta ação.",
        action: 'Verifique se o usuário possui a feature "read:store".',
        status_code: 403,
      });
    });

    test("With permission and valid request", async () => {
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

      const response = await fetch("http://localhost:3000/api/v1/stores", {
        headers: {
          Cookie: `session_id=${loggedUser.token}`,
        },
      });

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual(stores);
    });
  });

  describe("Anonymous user", () => {
    test("With valid data", async () => {
      const response = await fetch("http://localhost:3000/api/v1/stores");

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "O usuário não possui permissão para executar esta ação.",
        action: 'Verifique se o usuário possui a feature "read:store".',
        status_code: 403,
      });
    });
  });
});
