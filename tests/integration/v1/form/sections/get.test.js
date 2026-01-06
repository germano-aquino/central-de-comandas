import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/form/sections", () => {
  describe("Default user", () => {
    test("Without permission", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const response = await fetch(
        "http://localhost:3000/api/v1/form/sections",
        {
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
        action: 'Verifique se o usuário possui a feature "read:form_section".',
        status_code: 403,
      });
    });

    test("With permission and valid request", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.addFormSectionsFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      let formSections = await orchestrator.createSections(7, "form");
      formSections = formSections.map((section) => {
        return {
          ...section,
          created_at: section.created_at.toISOString(),
          updated_at: section.updated_at.toISOString(),
        };
      });

      const response = await fetch(
        "http://localhost:3000/api/v1/form/sections",
        {
          headers: {
            Cookie: `session_id=${userSession.token}`,
          },
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual(formSections);
    });
  });

  describe("Anonymous user", () => {
    test("With valid data", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/form/sections",
      );

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "O usuário não possui permissão para executar esta ação.",
        action: 'Verifique se o usuário possui a feature "read:form_section".',
        status_code: 403,
      });
    });
  });
});
