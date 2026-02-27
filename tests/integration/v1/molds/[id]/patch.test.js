import orchestrator from "tests/orchestrator";
import mold from "models/mold";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("PATCH /api/v1/molds/[:id]", () => {
  describe("Default user", () => {
    test("With valid data", async () => {
      const loggedUser = await orchestrator.createLoggedUser();

      const createdMold = await orchestrator.createMold();
      const response = await fetch(
        `http://localhost:3000/api/v1/molds/${createdMold.id}`,
        {
          method: "PATCH",
          headers: {
            Cookie: `session_id=${loggedUser.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            services_ids: [],
          }),
        },
      );

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "O usuário não possui permissão para executar esta ação.",
        action: 'Verifique se o usuário possui a feature "edit:mold".',
        status_code: 403,
      });
    });
  });

  describe("Allowed user", () => {
    test("With empty data", async () => {
      const loggedUser = await orchestrator.createLoggedUser();
      await orchestrator.addFeatures(loggedUser, mold.addFeatures);

      const storedMold = await orchestrator.createMold();

      const response = await fetch(
        `http://localhost:3000/api/v1/molds/${storedMold.id}`,
        {
          method: "PATCH",
          headers: {
            Cookie: `session_id=${loggedUser.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({}),
        },
      );
      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        ...storedMold,
        created_at: storedMold.created_at.toISOString(),
        updated_at: storedMold.updated_at.toISOString(),
      });
    });

    test("With category id update", async () => {
      const loggedUser = await orchestrator.createLoggedUser();
      await orchestrator.addFeatures(loggedUser, mold.addFeatures);

      const storedMold = await orchestrator.createMold();
      const newCategory = await orchestrator.createSection();

      const response = await fetch(
        `http://localhost:3000/api/v1/molds/${storedMold.id}`,
        {
          method: "PATCH",
          headers: {
            Cookie: `session_id=${loggedUser.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            category_ids: [...storedMold.category_ids, newCategory.id],
          }),
        },
      );
      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        ...storedMold,
        created_at: storedMold.created_at.toISOString(),
        updated_at: responseBody.updated_at,
        category_ids: [...storedMold.category_ids, newCategory.id],
      });
    });

    test("With form section id update", async () => {
      const loggedUser = await orchestrator.createLoggedUser();
      await orchestrator.addFeatures(loggedUser, mold.addFeatures);

      const storedMold = await orchestrator.createMold();
      const newFormSection = await orchestrator.createSection(
        undefined,
        "form",
      );

      const response = await fetch(
        `http://localhost:3000/api/v1/molds/${storedMold.id}`,
        {
          method: "PATCH",
          headers: {
            Cookie: `session_id=${loggedUser.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            form_section_ids: [
              ...storedMold.form_section_ids,
              newFormSection.id,
            ],
          }),
        },
      );
      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        ...storedMold,
        created_at: storedMold.created_at.toISOString(),
        updated_at: responseBody.updated_at,
        form_section_ids: [...storedMold.form_section_ids, newFormSection.id],
      });
    });

    test("With service id update", async () => {
      const loggedUser = await orchestrator.createLoggedUser();
      await orchestrator.addFeatures(loggedUser, mold.addFeatures);

      const storedMold = await orchestrator.createMold();
      const newService = await orchestrator.createService();

      const response = await fetch(
        `http://localhost:3000/api/v1/molds/${storedMold.id}`,
        {
          method: "PATCH",
          headers: {
            Cookie: `session_id=${loggedUser.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            service_ids: [...storedMold.service_ids, newService.id],
          }),
        },
      );
      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        ...storedMold,
        created_at: storedMold.created_at.toISOString(),
        updated_at: responseBody.updated_at,
        service_ids: [...storedMold.service_ids, newService.id],
      });
    });

    test("With question id update", async () => {
      const loggedUser = await orchestrator.createLoggedUser();
      await orchestrator.addFeatures(loggedUser, mold.addFeatures);

      const storedMold = await orchestrator.createMold();
      const newQuestion = await orchestrator.createQuestion();

      const response = await fetch(
        `http://localhost:3000/api/v1/molds/${storedMold.id}`,
        {
          method: "PATCH",
          headers: {
            Cookie: `session_id=${loggedUser.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            question_ids: [...storedMold.question_ids, newQuestion.id],
          }),
        },
      );
      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        ...storedMold,
        created_at: storedMold.created_at.toISOString(),
        updated_at: responseBody.updated_at,
        question_ids: [...storedMold.question_ids, newQuestion.id],
      });
    });

    test("With every data update", async () => {
      const loggedUser = await orchestrator.createLoggedUser();
      await orchestrator.addFeatures(loggedUser, mold.addFeatures);

      const storedMold = await orchestrator.createMold();

      const serviceSection = await orchestrator.createSection();
      const services = await orchestrator.createServices(5, {
        categoryId: serviceSection.id,
      });
      const serviceIds = services.map((service) => service.id);
      const formSection = await orchestrator.createSection(undefined, "form");
      const questions = await orchestrator.createQuestions(5, {
        sectionId: formSection.id,
      });
      const questionIds = questions.map((question) => question.id);

      const response = await fetch(
        `http://localhost:3000/api/v1/molds/${storedMold.id}`,
        {
          method: "PATCH",
          headers: {
            Cookie: `session_id=${loggedUser.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            form_section_ids: [formSection.id],
            question_ids: questionIds,
            category_ids: [serviceSection.id],
            service_ids: serviceIds,
          }),
        },
      );
      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody.form_section_ids).toEqual([formSection.id]);
      expect(responseBody.question_ids).toEqual(questionIds);
      expect(responseBody.category_ids).toEqual([serviceSection.id]);
      expect(responseBody.service_ids).toEqual(serviceIds);
      expect(responseBody.id).toBe(storedMold.id);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });
  });

  describe("Anonymous user", () => {
    test("With valid data", async () => {
      const moldId = "cbd746a2-6090-4e1d-9f92-873fca25514d";

      const response = await fetch(
        `http://localhost:3000/api/v1/molds/${moldId}`,
        {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            name: "NewCategory",
          }),
        },
      );

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "O usuário não possui permissão para executar esta ação.",
        action: 'Verifique se o usuário possui a feature "edit:mold".',
        status_code: 403,
      });
    });
  });
});
