import orchestrator from "tests/orchestrator";
import mold from "models/mold";

import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/molds", () => {
  describe("Default user", () => {
    test("With valid data", async () => {
      const loggedUser = await orchestrator.createLoggedUser();

      const serviceSection = await orchestrator.createSection("Waxing");
      const services = await orchestrator.createServices(5, {
        categoryId: serviceSection.id,
      });
      const serviceIds = services.map((service) => service.id);
      const formSection = await orchestrator.createSection("Brow", "form");
      const questions = await orchestrator.createQuestions(5, {
        sectionId: formSection.id,
      });
      const questionIds = questions.map((question) => question.id);

      const response = await fetch("http://localhost:3000/api/v1/molds", {
        method: "POST",
        headers: {
          Cookie: `session_id=${loggedUser.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          store_ids: [],
          form_section_ids: [formSection.id],
          question_ids: questionIds,
          category_ids: [serviceSection.id],
          services_ids: serviceIds,
        }),
      });

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "O usuário não possui permissão para executar esta ação.",
        action: 'Verifique se o usuário possui a feature "create:mold".',
        status_code: 403,
      });
    });
  });

  describe("Allowed user", () => {
    test("With empty data", async () => {
      const loggedUser = await orchestrator.createLoggedUser();
      await orchestrator.addFeatures(loggedUser, mold.addFeatures);

      const response = await fetch("http://localhost:3000/api/v1/molds", {
        method: "POST",
        headers: {
          Cookie: `session_id=${loggedUser.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({}),
      });
      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Não é possível criar um molde sem propriedades.",
        action: "Adicione propriedades válidas e tente novamente.",
        status_code: 400,
      });
    });

    test("With invalid category id", async () => {
      const loggedUser = await orchestrator.createLoggedUser();
      await orchestrator.addFeatures(loggedUser, mold.addFeatures);

      const invalidCategoryId = "cbd746a2-6090-4e1d-9f92-873fca25514d";

      const services = await orchestrator.createServices(5);
      const serviceIds = services.map((service) => service.id);
      const formSection = await orchestrator.createSection(undefined, "form");
      const questions = await orchestrator.createQuestions(5, {
        sectionId: formSection.id,
      });
      const questionIds = questions.map((question) => question.id);

      const response = await fetch("http://localhost:3000/api/v1/molds", {
        method: "POST",
        headers: {
          Cookie: `session_id=${loggedUser.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          form_section_ids: [formSection.id],
          question_ids: questionIds,
          category_ids: [invalidCategoryId],
          service_ids: serviceIds,
        }),
      });
      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Esta seção não existe.",
        action: "Verifique o id da seção e tente novamente.",
        status_code: 400,
      });
    });

    test("With invalid form section id", async () => {
      const loggedUser = await orchestrator.createLoggedUser();
      await orchestrator.addFeatures(loggedUser, mold.addFeatures);

      const invalidFormSectionId = "cbd746a2-6090-4e1d-9f92-873fca25514d";

      const serviceSection = await orchestrator.createSection();
      const services = await orchestrator.createServices(5, {
        categoryId: serviceSection.id,
      });
      const serviceIds = services.map((service) => service.id);
      const questions = await orchestrator.createQuestions(5);
      const questionIds = questions.map((question) => question.id);

      const response = await fetch("http://localhost:3000/api/v1/molds", {
        method: "POST",
        headers: {
          Cookie: `session_id=${loggedUser.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          form_section_ids: [invalidFormSectionId],
          question_ids: questionIds,
          category_ids: [serviceSection.id],
          service_ids: serviceIds,
        }),
      });
      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Esta seção não existe.",
        action: "Verifique o id da seção e tente novamente.",
        status_code: 400,
      });
    });

    test("With invalid service id", async () => {
      const loggedUser = await orchestrator.createLoggedUser();
      await orchestrator.addFeatures(loggedUser, mold.addFeatures);

      const invalidServiceId = "cbd746a2-6090-4e1d-9f92-873fca25514d";

      const serviceSection = await orchestrator.createSection();

      const formSection = await orchestrator.createSection(undefined, "form");
      const questions = await orchestrator.createQuestions(5, {
        sectionId: formSection.id,
      });
      const questionIds = questions.map((question) => question.id);

      const response = await fetch("http://localhost:3000/api/v1/molds", {
        method: "POST",
        headers: {
          Cookie: `session_id=${loggedUser.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          form_section_ids: [formSection.id],
          question_ids: questionIds,
          category_ids: [serviceSection.id],
          service_ids: [invalidServiceId],
        }),
      });
      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Este serviço não existe.",
        action: "Verifique o id do serviço e tente novamente.",
        status_code: 400,
      });
    });

    test("With invalid question id", async () => {
      const loggedUser = await orchestrator.createLoggedUser();
      await orchestrator.addFeatures(loggedUser, mold.addFeatures);

      const invalidQuestionId = "cbd746a2-6090-4e1d-9f92-873fca25514d";

      const serviceSection = await orchestrator.createSection();
      const services = await orchestrator.createServices(5, {
        categoryId: serviceSection.id,
      });
      const serviceIds = services.map((service) => service.id);
      const formSection = await orchestrator.createSection(undefined, "form");

      const response = await fetch("http://localhost:3000/api/v1/molds", {
        method: "POST",
        headers: {
          Cookie: `session_id=${loggedUser.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          form_section_ids: [formSection.id],
          question_ids: [invalidQuestionId],
          category_ids: [serviceSection.id],
          service_ids: serviceIds,
        }),
      });
      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Pergunta não existe.",
        action: "Verifique se o id da pergunta está correto e tente novamente.",
        status_code: 400,
      });
    });

    test("With valid data", async () => {
      const loggedUser = await orchestrator.createLoggedUser();
      await orchestrator.addFeatures(loggedUser, mold.addFeatures);

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

      const response = await fetch("http://localhost:3000/api/v1/molds", {
        method: "POST",
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
      });
      expect(response.status).toBe(201);

      const responseBody = await response.json();

      expect(responseBody.form_section_ids).toEqual([formSection.id]);
      expect(responseBody.question_ids).toEqual(questionIds);
      expect(responseBody.category_ids).toEqual([serviceSection.id]);
      expect(responseBody.service_ids).toEqual(serviceIds);
      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });
  });

  describe("Anonymous user", () => {
    test("With valid data", async () => {
      const response = await fetch("http://localhost:3000/api/v1/molds", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name: "NewCategory",
        }),
      });

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "O usuário não possui permissão para executar esta ação.",
        action: 'Verifique se o usuário possui a feature "create:mold".',
        status_code: 403,
      });
    });
  });
});
