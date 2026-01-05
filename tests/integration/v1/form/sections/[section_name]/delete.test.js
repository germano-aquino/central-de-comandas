import { NotFoundError } from "infra/errors";
import category from "models/category";
import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("DELETE /api/v1/form/sections/[section_name]", () => {
  describe("Default user", () => {
    test("With valid data and without permission", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const formSection = await orchestrator.createFormSection("OldName");

      const response = await fetch(
        `http://localhost:3000/api/v1/form/sections/${formSection.name}`,
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
        action:
          'Verifique se o usuário possui a feature "delete:form_section".',
        status_code: 403,
      });
    });

    test("With permission and valid data", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.addFormSectionsFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const sectionToBeDeleted = await orchestrator.createFormSection();

      const response = await fetch(
        `http://localhost:3000/api/v1/form/sections/${sectionToBeDeleted.name}`,
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
        id: sectionToBeDeleted.id,
        name: sectionToBeDeleted.name,
        created_at: sectionToBeDeleted.created_at.toISOString(),
        updated_at: sectionToBeDeleted.updated_at.toISOString(),
      });

      //Verify that category doesn't exist on database

      await expect(
        category.findOneValidByName(sectionToBeDeleted.name),
      ).rejects.toThrow(NotFoundError);
    });

    test("With permission and with different case", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.addFormSectionsFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const sectionToBeDeleted =
        await orchestrator.createFormSection("mismatchcase");

      const response = await fetch(
        `http://localhost:3000/api/v1/form/sections/MismatchCase`,
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
        id: sectionToBeDeleted.id,
        name: "mismatchcase",
        created_at: sectionToBeDeleted.created_at.toISOString(),
        updated_at: sectionToBeDeleted.updated_at.toISOString(),
      });

      //Verify that category doesn't exist on database

      await expect(
        category.findOneValidByName(sectionToBeDeleted.name),
      ).rejects.toThrow(NotFoundError);
    });

    test("With permission and nonexistent category name", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.addFormSectionsFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const response = await fetch(
        `http://localhost:3000/api/v1/form/sections/NonexistentCategory`,
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
        message: "Esta seção não existe.",
        action: "Verifique o nome da seção e tente novamente.",
        status_code: 404,
      });
    });
  });

  describe("Anonymous user", () => {
    test("With valid data", async () => {
      const category = await orchestrator.createFormSection();

      const response = await fetch(
        `http://localhost:3000/api/v1/form/sections/${category.name}`,
        {
          method: "DELETE",
        },
      );

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "O usuário não possui permissão para executar esta ação.",
        action:
          'Verifique se o usuário possui a feature "delete:form_section".',
        status_code: 403,
      });
    });
  });
});
