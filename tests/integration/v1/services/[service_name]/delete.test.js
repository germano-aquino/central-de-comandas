import { NotFoundError } from "infra/errors";
import service from "models/service";
import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("DELETE /api/v1/services/[service_name]", () => {
  describe("Default user", () => {
    test("With valid data and without permission", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const service = await orchestrator.createService("OldName");

      const response = await fetch(
        `http://localhost:3000/api/v1/services/${service.name}`,
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
        action: 'Verifique se o usuário possui a feature "delete:service".',
        status_code: 403,
      });
    });

    test("With permission and valid data", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.addServicesFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const serviceToBeDeleted = await orchestrator.createService();

      const response = await fetch(
        `http://localhost:3000/api/v1/services/${serviceToBeDeleted.name}`,
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
        ...serviceToBeDeleted,
        created_at: serviceToBeDeleted.created_at.toISOString(),
        updated_at: serviceToBeDeleted.updated_at.toISOString(),
      });

      //Verify that service doesn't exist on database

      await expect(
        service.findOneValidByName(serviceToBeDeleted.name),
      ).rejects.toThrow(NotFoundError);
    });

    test("With permission and with different case", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.addServicesFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const serviceToBeDeleted =
        await orchestrator.createService("mismatchcase");

      const response = await fetch(
        `http://localhost:3000/api/v1/services/MismatchCase`,
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
        ...serviceToBeDeleted,
        created_at: serviceToBeDeleted.created_at.toISOString(),
        updated_at: serviceToBeDeleted.updated_at.toISOString(),
      });

      //Verify that service doesn't exist on database

      await expect(
        service.findOneValidByName(serviceToBeDeleted.name),
      ).rejects.toThrow(NotFoundError);
    });

    test("With permission and nonexistent service name", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.addServicesFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const response = await fetch(
        `http://localhost:3000/api/v1/services/NonexistentCategory`,
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
        message: "Este serviço não existe.",
        action: "Verifique o nome do serviço e tente novamente.",
        status_code: 404,
      });
    });
  });

  describe("Anonymous user", () => {
    test("With valid data", async () => {
      const service = await orchestrator.createService();

      const response = await fetch(
        `http://localhost:3000/api/v1/services/${service.name}`,
        {
          method: "DELETE",
        },
      );

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
