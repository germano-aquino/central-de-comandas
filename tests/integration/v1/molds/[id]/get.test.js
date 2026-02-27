import orchestrator from "tests/orchestrator";
import mold from "models/mold";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/molds/[:id]", () => {
  describe("Default user", () => {
    test("With valid data", async () => {
      const loggedUser = await orchestrator.createLoggedUser();
      const moldId = "cbd746a2-6090-4e1d-9f92-873fca25514d";

      const response = await fetch(
        `http://localhost:3000/api/v1/molds/${moldId}`,
        {
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
        action: 'Verifique se o usuário possui a feature "read:mold".',
        status_code: 403,
      });
    });
  });

  describe("Allowed user", () => {
    test("With nonexistent mold id", async () => {
      const loggedUser = await orchestrator.createLoggedUser();
      await orchestrator.addFeatures(loggedUser, mold.addFeatures);

      const nonexistentMoldId = "cbd746a2-6090-4e1d-9f92-873fca25514d";

      await orchestrator.createMolds();

      const response = await fetch(
        `http://localhost:3000/api/v1/molds/${nonexistentMoldId}`,
        {
          method: "GET",
          headers: {
            Cookie: `session_id=${loggedUser.token}`,
          },
        },
      );
      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "Não existe um molde correspondente para este id.",
        action: "Verifique se o id está correto e tente novamente.",
        status_code: 404,
      });
    });

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

      const response = await fetch(
        `http://localhost:3000/api/v1/molds/${molds[0].id}`,
        {
          method: "GET",
          headers: {
            Cookie: `session_id=${loggedUser.token}`,
          },
        },
      );
      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual(molds[0]);
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
