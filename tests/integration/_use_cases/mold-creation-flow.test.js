import mold from "@/models/mold";
import store from "@/models/store";
import orchestrator from "@/tests/orchestrator";

import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("Mold Creation Flow (all successfull)", () => {
  let loggedUser;

  let storeObject;

  let categories;

  let waxingServices;
  let lineServices;
  let facialServices;
  let bodyServices;
  let nailPolishServices;

  let formSections;

  let waxingQuestions;
  let browQuestions;
  let nailPolishQuestions;
  let highFrequencyQuestions;

  let moldObject;

  test("Create new store", async () => {
    loggedUser = await orchestrator.createLoggedUser();
    await orchestrator.addFeatures(loggedUser, store.addFeatures);

    const response = await fetch("http://localhost:3000/api/v1/stores", {
      method: "POST",
      headers: {
        Cookie: `session_id=${loggedUser.token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name: "14 de Abril",
      }),
    });

    expect(response.status).toBe(201);

    const responseBody = await response.json();

    expect(responseBody.name).toBe("14 de Abril");
    expect(uuidVersion(responseBody.id)).toBe(4);
    expect(Date.parse(responseBody.created_at)).not.toBeNaN();
    expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

    storeObject = responseBody;
  });

  test("Create new categories and new services with is mold as true", async () => {
    categories = await orchestrator.createSections(5, "service", [
      "Depilação",
      "Depilação à Linha",
      "Estética Facial",
      "Estética Corporal",
      "Esmalteria",
    ]);

    waxingServices = await orchestrator.createServices(5, {
      categoryId: categories[0].id,
      isMold: true,
    });

    lineServices = await orchestrator.createServices(5, {
      categoryId: categories[1].id,
      isMold: true,
    });

    facialServices = await orchestrator.createServices(5, {
      categoryId: categories[2].id,
      isMold: true,
    });

    bodyServices = await orchestrator.createServices(5, {
      categoryId: categories[3].id,
      isMold: true,
    });

    nailPolishServices = await orchestrator.createServices(5, {
      categoryId: categories[4].id,
      isMold: true,
    });

    waxingServices.map((service) => {
      expect(service.category_id).toBe(categories[0].id);
      expect(service.is_mold).toBe(true);
    });

    lineServices.map((service) => {
      expect(service.category_id).toBe(categories[1].id);
      expect(service.is_mold).toBe(true);
    });

    facialServices.map((service) => {
      expect(service.category_id).toBe(categories[2].id);
      expect(service.is_mold).toBe(true);
    });

    bodyServices.map((service) => {
      expect(service.category_id).toBe(categories[3].id);
      expect(service.is_mold).toBe(true);
    });

    nailPolishServices.map((service) => {
      expect(service.category_id).toBe(categories[4].id);
      expect(service.is_mold).toBe(true);
    });
  });

  test("Create new form sections and new questions with is mold as true", async () => {
    formSections = await orchestrator.createSections(4, "form", [
      "Depilação",
      "Sombrancelhas",
      "Esmalteria",
      "Alta Frequencia",
    ]);

    waxingQuestions = await orchestrator.createQuestions(3, {
      sectionId: formSections[0].id,
      isMold: true,
    });

    browQuestions = await orchestrator.createQuestions(3, {
      sectionId: formSections[1].id,
      isMold: true,
    });

    nailPolishQuestions = await orchestrator.createQuestions(3, {
      sectionId: formSections[2].id,
      isMold: true,
    });

    highFrequencyQuestions = await orchestrator.createQuestions(3, {
      sectionId: formSections[3].id,
      isMold: true,
    });

    waxingQuestions.map((question) => {
      expect(question.section_id).toBe(formSections[0].id);
      expect(question.is_mold).toBe(true);
    });

    browQuestions.map((question) => {
      expect(question.section_id).toBe(formSections[1].id);
      expect(question.is_mold).toBe(true);
    });

    nailPolishQuestions.map((question) => {
      expect(question.section_id).toBe(formSections[2].id);
      expect(question.is_mold).toBe(true);
    });

    highFrequencyQuestions.map((question) => {
      expect(question.section_id).toBe(formSections[3].id);
      expect(question.is_mold).toBe(true);
    });
  });

  test("Create mold with services and questions previously created", async () => {
    await orchestrator.addFeatures(loggedUser, mold.addFeatures);

    const serviceIds = [
      ...waxingServices,
      ...lineServices,
      ...facialServices,
      ...bodyServices,
      ...nailPolishServices,
    ].map((service) => service.id);

    const questionIds = [
      ...waxingQuestions,
      ...browQuestions,
      ...nailPolishQuestions,
      ...highFrequencyQuestions,
    ].map((question) => question.id);

    const response = await fetch("http://localhost:3000/api/v1/molds", {
      method: "POST",
      headers: {
        Cookie: `session_id=${loggedUser.token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        service_ids: serviceIds,
        question_ids: questionIds,
        category_ids: categories.map((category) => category.id),
        form_section_ids: formSections.map((section) => section.id),
      }),
    });

    expect(response.status).toBe(201);

    const responseBody = await response.json();

    expect(responseBody.service_ids).toEqual(serviceIds);
    expect(responseBody.question_ids).toEqual(questionIds);

    moldObject = responseBody;
  });

  test("Assign to the store the new mold id", async () => {
    const response = await fetch(
      `http:/localhost:3000/api/v1/stores/${storeObject.name}`,
      {
        method: "PATCH",
        headers: {
          Cookie: `session_id=${loggedUser.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          mold_id: moldObject.id,
        }),
      },
    );

    expect(response.status).toBe(200);

    const responseBody = await response.json();

    expect(responseBody.mold_id).toBe(moldObject.id);
  });
});
