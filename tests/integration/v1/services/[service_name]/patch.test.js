import serviceModel from "@/models/service";
import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("PATCH /api/v1/services/[service_name]", () => {
  describe("Default user", () => {
    test("With valid data", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const service = await orchestrator.createService("OldName");

      const response = await fetch(
        `http://localhost:3000/api/v1/services/${service.name}`,
        {
          method: "PATCH",
          headers: {
            Cookie: `session_id=${userSession.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            name: "NewName",
          }),
        },
      );

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "O usuário não possui permissão para executar esta ação.",
        action: 'Verifique se o usuário possui a feature "edit:service".',
        status_code: 403,
      });
    });
  });

  describe("Allowed user", () => {
    test("Update name", async () => {
      const loggedUser = await orchestrator.createLoggedUser();
      await orchestrator.addFeatures(loggedUser, serviceModel.addFeatures);

      const service = await orchestrator.createService();

      const response = await fetch(
        `http://localhost:3000/api/v1/services/${service.name}`,
        {
          method: "PATCH",
          headers: {
            Cookie: `session_id=${loggedUser.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            name: "Update Name",
          }),
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        ...service,
        name: "Update Name",
        updated_at: responseBody.updated_at,
        created_at: service.created_at.toISOString(),
      });
      expect(Date.parse(responseBody.created_at)).toBeLessThan(
        Date.parse(responseBody.updated_at),
      );
    });

    test("WWith new price", async () => {
      const loggedUser = await orchestrator.createLoggedUser();
      await orchestrator.addFeatures(loggedUser, serviceModel.addFeatures);

      const service = await orchestrator.createService();

      const response = await fetch(
        `http://localhost:3000/api/v1/services/${service.name}`,
        {
          method: "PATCH",
          headers: {
            Cookie: `session_id=${loggedUser.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            price: 6666,
          }),
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        ...service,
        price: 6666,
        updated_at: responseBody.updated_at,
        created_at: service.created_at.toISOString(),
      });
      expect(Date.parse(responseBody.created_at)).toBeLessThan(
        Date.parse(responseBody.updated_at),
      );
    });

    test("With new category id", async () => {
      const loggedUser = await orchestrator.createLoggedUser();
      await orchestrator.addFeatures(loggedUser, serviceModel.addFeatures);

      const [category1, category2] = await orchestrator.createSections(2);
      const service = await orchestrator.createService(
        undefined,
        undefined,
        category1.id,
      );

      const response = await fetch(
        `http://localhost:3000/api/v1/services/${service.name}`,
        {
          method: "PATCH",
          headers: {
            Cookie: `session_id=${loggedUser.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            category_id: category2.id,
          }),
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        ...service,
        category_id: category2.id,
        updated_at: responseBody.updated_at,
        created_at: service.created_at.toISOString(),
      });
      expect(Date.parse(responseBody.created_at)).toBeLessThan(
        Date.parse(responseBody.updated_at),
      );
    });

    test("With new is mold", async () => {
      const loggedUser = await orchestrator.createLoggedUser();
      await orchestrator.addFeatures(loggedUser, serviceModel.addFeatures);

      const service = await orchestrator.createService();

      const response = await fetch(
        `http://localhost:3000/api/v1/services/${service.name}`,
        {
          method: "PATCH",
          headers: {
            Cookie: `session_id=${loggedUser.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            is_mold: true,
          }),
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        ...service,
        is_mold: true,
        updated_at: responseBody.updated_at,
        created_at: service.created_at.toISOString(),
      });
      expect(Date.parse(responseBody.created_at)).toBeLessThan(
        Date.parse(responseBody.updated_at),
      );
    });

    test("With every information new", async () => {
      const loggedUser = await orchestrator.createLoggedUser();
      await orchestrator.addFeatures(loggedUser, serviceModel.addFeatures);

      const service = await orchestrator.createService();
      const category = await orchestrator.createSection();

      const response = await fetch(
        `http://localhost:3000/api/v1/services/${service.name}`,
        {
          method: "PATCH",
          headers: {
            Cookie: `session_id=${loggedUser.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            name: "UpdateAllInfos",
            price: 6666,
            category_id: category.id,
            is_mold: true,
          }),
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: service.id,
        name: "UpdateAllInfos",
        price: 6666,
        category_id: category.id,
        is_mold: true,
        created_at: service.created_at.toISOString(),
        updated_at: responseBody.updated_at,
      });
      expect(Date.parse(responseBody.created_at)).toBeLessThan(
        Date.parse(responseBody.updated_at),
      );
    });

    test("With different name case", async () => {
      const loggedUser = await orchestrator.createLoggedUser();
      await orchestrator.addFeatures(loggedUser, serviceModel.addFeatures);

      const service = await orchestrator.createService("mismatchcase");

      const response = await fetch(
        `http://localhost:3000/api/v1/services/${service.name}`,
        {
          method: "PATCH",
          headers: {
            Cookie: `session_id=${loggedUser.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            name: "misMatchCase",
          }),
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        ...service,
        name: "misMatchCase",
        updated_at: responseBody.updated_at,
        created_at: service.created_at.toISOString(),
      });

      expect(Date.parse(responseBody.created_at)).toBeLessThan(
        Date.parse(responseBody.updated_at),
      );
    });

    test("With nonexistent service name", async () => {
      const loggedUser = await orchestrator.createLoggedUser();
      await orchestrator.addFeatures(loggedUser, serviceModel.addFeatures);

      const response = await fetch(
        `http://localhost:3000/api/v1/services/NonexistentService`,
        {
          method: "PATCH",
          headers: {
            Cookie: `session_id=${loggedUser.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            name: "UpdateNonExistentService",
          }),
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
          method: "PATCH",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            name: "othername",
          }),
        },
      );

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "O usuário não possui permissão para executar esta ação.",
        action: 'Verifique se o usuário possui a feature "edit:service".',
        status_code: 403,
      });
    });
  });
});
