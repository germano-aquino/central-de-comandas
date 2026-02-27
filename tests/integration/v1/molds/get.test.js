import orchestrator from "tests/orchestrator";
import mold from "models/mold";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/molds", () => {
  describe("Default user", () => {
    test("With valid data", async () => {
      const loggedUser = await orchestrator.createLoggedUser();

      const response = await fetch("http://localhost:3000/api/v1/molds", {
        headers: {
          Cookie: `session_id=${loggedUser.token}`,
        },
      });

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "O usuário não possui permissão para executar esta ação.",
        action: 'Verifique se o usuário possui a feature "read:mold".',
        status_code: 403,
      });
    });
  });

  describe("Allowed user", () => {
    test("With valid data", async () => {
      const loggedUser = await orchestrator.createLoggedUser();
      await orchestrator.addFeatures(loggedUser, mold.addFeatures);

      let molds = await orchestrator.createMolds();
      molds = molds.map((mold) => {
        return {
          ...mold,
          updated_at: mold.updated_at.toISOString(),
          created_at: mold.created_at.toISOString(),
        };
      });

      const response = await fetch("http://localhost:3000/api/v1/molds", {
        method: "GET",
        headers: {
          Cookie: `session_id=${loggedUser.token}`,
        },
      });
      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual(molds);
    });
  });

  describe("Anonymous user", () => {
    test("With valid data", async () => {
      const response = await fetch("http://localhost:3000/api/v1/molds");

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "O usuário não possui permissão para executar esta ação.",
        action: 'Verifique se o usuário possui a feature "read:mold".',
        status_code: 403,
      });
    });
  });
});
