import { NotFoundError } from "infra/errors";
import service from "models/service";
import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("DELETE /api/v1/services", () => {
  describe("Default user", () => {
    test("Without permission", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      const userSession = await orchestrator.createSession(activatedUser);

      let services = await orchestrator.createCategories(7);
      const serviceIds = services.map((service) => service.id);

      const response = await fetch("http://localhost:3000/api/v1/services", {
        method: "DELETE",
        headers: {
          Cookie: `session_id=${userSession.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          service_ids: serviceIds,
        }),
      });

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "O usuário não possui permissão para executar esta ação.",
        action: 'Verifique se o usuário possui a feature "delete:service".',
        status_code: 403,
      });
    });

    test("With permission and valid data", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.addServicesFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      let services = await orchestrator.createServices(7);
      services = services.map((service) => {
        return {
          ...service,
          created_at: service.created_at.toISOString(),
          updated_at: service.updated_at.toISOString(),
        };
      });
      const serviceIds = services.map((service) => service.id);

      const response = await fetch("http://localhost:3000/api/v1/services", {
        method: "DELETE",
        headers: {
          Cookie: `session_id=${userSession.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          service_ids: serviceIds,
        }),
      });

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual(services);

      //Verify that service doesn't exist on database

      services.map(async (deletedService) => {
        await expect(
          service.findOneValidByName(deletedService.name),
        ).rejects.toThrow(NotFoundError);
      });
    });

    test("With permission and nonexistent service ids", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.addServicesFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const response = await fetch(`http://localhost:3000/api/v1/services`, {
        method: "DELETE",
        headers: {
          Cookie: `session_id=${userSession.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          service_ids: [
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
      const services = await orchestrator.createCategories(7);
      const serviceIds = services.map((service) => service.id);

      const response = await fetch("http://localhost:3000/api/v1/services", {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          service_ids: serviceIds,
        }),
      });

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "O usuário não possui permissão para executar esta ação.",
        action: 'Verifique se o usuário possui a feature "delete:service".',
        status_code: 403,
      });
    });
  });
});
