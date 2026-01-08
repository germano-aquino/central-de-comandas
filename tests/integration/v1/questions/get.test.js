import orchestrator from "tests/orchestrator";

let sections;
let questionsByType = {
  all: [],
  "multiple-choice": [],
  discursive: [],
  both: [],
  noSection: [],
};
let questionsBySection = [];

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();

  await createQuestions();
});

describe("GET /api/v1/questions", () => {
  describe("Default user", () => {
    test("Without permission and valida data", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const response = await fetch("http://localhost:3000/api/v1/questions", {
        method: "GET",
        headers: {
          Cookie: `session_id=${userSession.token}`,
          "content-type": "application/json",
        },
      });

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "O usuário não possui permissão para executar esta ação.",
        action: 'Verifique se o usuário possui a feature "read:question".',
        status_code: 403,
      });
    });
  });

  describe("Allowed user", () => {
    test("Retrieve all questions", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.addQuestionsFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const response = await fetch("http://localhost:3000/api/v1/questions", {
        method: "GET",
        headers: {
          Cookie: `session_id=${userSession.token}`,
          "content-type": "application/json",
        },
      });

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual(questionsByType.all);
    });

    test("Retrieve all filtering by section", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.addQuestionsFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      for (let i = 0; i < 3; i++) {
        const params = new URLSearchParams();
        params.append("form_section_name", sections[i].name);

        const response = await fetch(
          `http://localhost:3000/api/v1/questions?${params}`,
          {
            method: "GET",
            headers: {
              Cookie: `session_id=${userSession.token}`,
              "content-type": "application/json",
            },
          },
        );

        expect(response.status).toBe(200);

        const responseBody = await response.json();

        expect(responseBody).toEqual(questionsBySection[i]);
      }
    });

    test("Retrieve all filtering by section with invalid section", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.addQuestionsFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const params = new URLSearchParams();
      params.set("form_section_name", "nonExistentSection");

      const response = await fetch(
        `http://localhost:3000/api/v1/questions?${params}`,
        {
          method: "GET",
          headers: {
            Cookie: `session_id=${userSession.token}`,
            "content-type": "application/json",
          },
        },
      );

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Esta seção não existe.",
        action: "Verifique o nome da seção e tente novamente.",
        status_code: 400,
      });
    });

    test("Retrieve all filtering by type", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.addQuestionsFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const questionTypes = ["multiple-choice", "discursive", "both"];
      for (const type of questionTypes) {
        const params = new URLSearchParams();
        params.append("question_type", type);

        const response = await fetch(
          `http://localhost:3000/api/v1/questions?${params}`,
          {
            method: "GET",
            headers: {
              Cookie: `session_id=${userSession.token}`,
              "content-type": "application/json",
            },
          },
        );

        expect(response.status).toBe(200);

        const responseBody = await response.json();

        expect(responseBody).toEqual(questionsByType[type]);
      }
    });

    test("Retrieve all filtering by type with invalid type", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.addQuestionsFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const params = new URLSearchParams();
      params.set("question_type", "nonExistentType");

      const response = await fetch(
        `http://localhost:3000/api/v1/questions?${params}`,
        {
          method: "GET",
          headers: {
            Cookie: `session_id=${userSession.token}`,
            "content-type": "application/json",
          },
        },
      );

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Tipo da pergunta inválido.",
        action:
          "Verifique se a propriedade type é algum dos seguintes valores: 'multiple-choice', 'discursive', 'both'.",
        status_code: 400,
      });
    });

    test("Retrieve questions without form section", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.addQuestionsFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const params = new URLSearchParams();
      params.set("no_form_section", "");

      const response = await fetch(
        `http://localhost:3000/api/v1/questions?${params}`,
        {
          method: "GET",
          headers: {
            Cookie: `session_id=${userSession.token}`,
            "content-type": "application/json",
          },
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual(questionsBySection[3]);
    });
  });

  describe("Anonymous user", () => {
    test("With valid data", async () => {
      const response = await fetch("http://localhost:3000/api/v1/questions", {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      });

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "O usuário não possui permissão para executar esta ação.",
        action: 'Verifique se o usuário possui a feature "read:question".',
        status_code: 403,
      });
    });
  });
});

async function createQuestions() {
  sections = await orchestrator.createSections(3, "form");
  const sectionIds = sections.map((section) => section.id);

  await createQuestionsToEachSection(sectionIds);

  Object.keys(questionsByType).forEach((key) => {
    questionsByType[key] = convertDateToISOString(questionsByType[key]);
  });
  questionsBySection = questionsBySection.map(convertDateToISOString);
}

async function createQuestionsToEachSection(sectionIds, questionsAmount = 3) {
  for (const id of sectionIds) {
    const multipleChoiceQuestions = await orchestrator.createQuestions(
      questionsAmount,
      {
        sectionId: id,
      },
    );
    const discursiveQuestions = await orchestrator.createQuestions(
      questionsAmount,
      {
        sectionId: id,
        type: "discursive",
      },
    );
    const bothQuestions = await orchestrator.createQuestions(questionsAmount, {
      sectionId: id,
      type: "both",
    });

    questionsBySection.push([
      ...multipleChoiceQuestions,
      ...discursiveQuestions,
      ...bothQuestions,
    ]);
    questionsByType.all.push(
      ...multipleChoiceQuestions,
      ...discursiveQuestions,
      ...bothQuestions,
    );
    questionsByType["multiple-choice"].push(...multipleChoiceQuestions);
    questionsByType.discursive.push(...discursiveQuestions);
    questionsByType.both.push(...bothQuestions);
  }
  const noSectionQuestions = await orchestrator.createQuestions();

  questionsBySection.push(noSectionQuestions);
  questionsByType.all.push(...noSectionQuestions);
  questionsByType["multiple-choice"].push(...noSectionQuestions);
}

function convertDateToISOString(objects) {
  const transformedObjects = objects.map((object) => {
    return {
      ...object,
      created_at: object.created_at.toISOString(),
      updated_at: object.updated_at.toISOString(),
    };
  });

  return transformedObjects;
}
