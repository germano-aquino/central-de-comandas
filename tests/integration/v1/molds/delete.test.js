import orchestrator from "tests/orchestrator";
import mold from "models/mold";
import { NotFoundError } from "@/infra/errors";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("DELETE /api/v1/molds", () => {
  describe("Default user", () => {
    test("With valid data", async () => {
      const loggedUser = await orchestrator.createLoggedUser();
      const moldIdToBeDeleted = "cbd746a2-6090-4e1d-9f92-873fca25514d";

      const response = await fetch("http://localhost:3000/api/v1/molds", {
        method: "DELETE",
        headers: {
          Cookie: `session_id=${loggedUser.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          mold_ids: [moldIdToBeDeleted],
        }),
      });

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "O usuário não possui permissão para executar esta ação.",
        action: 'Verifique se o usuário possui a feature "delete:mold".',
        status_code: 403,
      });
    });
  });

  describe("Allowed user", () => {
    test("With nonexistent mold ids", async () => {
      const loggedUser = await orchestrator.createLoggedUser();
      await orchestrator.addFeatures(loggedUser, mold.addFeatures);

      const response = await fetch("http://localhost:3000/api/v1/molds", {
        method: "DELETE",
        headers: {
          Cookie: `session_id=${loggedUser.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          mold_ids: [
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
      const moldIdsToBeDeleted = molds.map((mold) => mold.id);

      const response = await fetch("http://localhost:3000/api/v1/molds", {
        method: "DELETE",
        headers: {
          Cookie: `session_id=${loggedUser.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          mold_ids: moldIdsToBeDeleted,
        }),
      });
      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual(molds);
      for (const deletedMold of molds) {
        await expect(mold.findOneValidById(deletedMold.id)).rejects.toThrow(
          NotFoundError,
        );
      }
    });
  });

  describe("Anonymous user", () => {
    test("With valid data", async () => {
      const response = await fetch("http://localhost:3000/api/v1/molds", {
        method: "DELETE",
      });

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "O usuário não possui permissão para executar esta ação.",
        action: 'Verifique se o usuário possui a feature "delete:mold".',
        status_code: 403,
      });
    });
  });
});
