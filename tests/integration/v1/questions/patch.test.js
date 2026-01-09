import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("PATCH /api/v1/questions", () => {
  describe("Default user", () => {
    test("With valid data", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const questions = await orchestrator.createQuestions(3);
      const questionIds = questions.map((question) => question.id);

      const response = await fetch("http://localhost:3000/api/v1/questions", {
        method: "PATCH",
        headers: {
          Cookie: `session_id=${userSession.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          question_ids: questionIds,
          options: ["Sim", "Não", "Talvez"],
        }),
      });

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "O usuário não possui permissão para executar esta ação.",
        action: 'Verifique se o usuário possui a feature "edit:question".',
        status_code: 403,
      });
    });
  });

  describe("Allowed user", () => {
    test("With new statement", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.addQuestionsFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const questions = await orchestrator.createQuestions(3);
      const questionIds = questions.map((question) => question.id);

      const response = await fetch("http://localhost:3000/api/v1/questions", {
        method: "PATCH",
        headers: {
          Cookie: `session_id=${userSession.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          question_ids: questionIds,
          statement:
            "Trying to change multiple questions with the same statement.",
        }),
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message:
          "Não é possível editar o título de múltiplas perguntas com uma única requisição.",
        action:
          "Retire a propriedade 'statement' da requisição e tente novamente.",
        status_code: 400,
      });
    });

    test("With new type", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.addQuestionsFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const questions = await orchestrator.createQuestions(3);
      const questionIds = questions.map((question) => question.id);

      const response = await fetch("http://localhost:3000/api/v1/questions", {
        method: "PATCH",
        headers: {
          Cookie: `session_id=${userSession.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          question_ids: questionIds,
          type: "both",
        }),
      });

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      const questionsWithNewCategory = questions.map((question) => {
        return {
          ...question,
          created_at: question.created_at.toISOString(),
          updated_at: responseBody[0].updated_at,
          type: "both",
        };
      });

      expect(responseBody).toEqual(questionsWithNewCategory);

      expect(Date.parse(responseBody[0].updated_at)).toBeGreaterThan(
        Date.parse(responseBody[0].created_at),
      );
    });

    test("With new type as multiple-choice and missing options", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.addQuestionsFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const questions = await orchestrator.createQuestions(3, {
        type: "discursive",
      });
      const questionIds = questions.map((question) => question.id);

      const response = await fetch("http://localhost:3000/api/v1/questions", {
        method: "PATCH",
        headers: {
          Cookie: `session_id=${userSession.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          question_ids: questionIds,
          type: "multiple-choice",
        }),
      });

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "BadRequest",
        message:
          "O novo tipo de perunta necessita de pelo menos duas opções para ser válido.",
        action: "Envie a propriedade 'options' com pelo menos duas opções.",
        status_code: 404,
      });
    });

    test("With new type as multiple-choice and less than 2 options", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.addQuestionsFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const questions = await orchestrator.createQuestions(3, {
        type: "discursive",
      });
      const questionIds = questions.map((question) => question.id);

      const response = await fetch("http://localhost:3000/api/v1/questions", {
        method: "PATCH",
        headers: {
          Cookie: `session_id=${userSession.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          question_ids: questionIds,
          type: "multiple-choice",
          options: ["Sim"],
        }),
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message:
          "O novo tipo de perunta necessita de pelo menos duas opções para ser válido.",
        action: "Envie a propriedade 'options' com pelo menos duas opções.",
        status_code: 400,
      });
    });

    test("With new options", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.addQuestionsFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const questions = await orchestrator.createQuestions(3);
      const questionIds = questions.map((question) => question.id);

      const response = await fetch("http://localhost:3000/api/v1/questions", {
        method: "PATCH",
        headers: {
          Cookie: `session_id=${userSession.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          question_ids: questionIds,
          options: ["green", "blue", "red"],
        }),
      });

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      const questionsWithNewCategory = questions.map((question) => {
        return {
          ...question,
          created_at: question.created_at.toISOString(),
          updated_at: responseBody[0].updated_at,
          options: ["green", "blue", "red"],
        };
      });

      expect(responseBody).toEqual(questionsWithNewCategory);

      expect(Date.parse(responseBody[0].updated_at)).toBeGreaterThan(
        Date.parse(responseBody[0].created_at),
      );
    });

    test("With less than 2 options", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.addQuestionsFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const questions = await orchestrator.createQuestions(3);
      const questionIds = questions.map((question) => question.id);

      const response = await fetch("http://localhost:3000/api/v1/questions", {
        method: "PATCH",
        headers: {
          Cookie: `session_id=${userSession.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          question_ids: questionIds,
          options: ["Sim"],
        }),
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message:
          "O novo tipo de perunta necessita de pelo menos duas opções para ser válido.",
        action: "Envie a propriedade 'options' com pelo menos duas opções.",
        status_code: 400,
      });
    });

    test("With new options and removing option marked from possible options", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.addQuestionsFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const questions = await orchestrator.createQuestions(3, {
        options: ["red", "blue", "green"],
        optionMarked: "red",
      });
      const questionIds = questions.map((question) => question.id);

      const response = await fetch("http://localhost:3000/api/v1/questions", {
        method: "PATCH",
        headers: {
          Cookie: `session_id=${userSession.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          question_ids: questionIds,
          options: ["Sim", "Não"],
        }),
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "As novas opções não contém a opção marcada.",
        action:
          "Modifique a opção marcada ou inclua a opção marcada entre as opções possíveis.",
        status_code: 400,
      });
    });

    test("With new answer", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.addQuestionsFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const questions = await orchestrator.createQuestions(3, {
        type: "discursive",
      });
      const questionIds = questions.map((question) => question.id);

      const response = await fetch("http://localhost:3000/api/v1/questions", {
        method: "PATCH",
        headers: {
          Cookie: `session_id=${userSession.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          question_ids: questionIds,
          answer: "Creating new answer.",
        }),
      });

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      const questionsWithNewCategory = questions.map((question) => {
        return {
          ...question,
          created_at: question.created_at.toISOString(),
          updated_at: responseBody[0].updated_at,
          answer: "Creating new answer.",
        };
      });

      expect(responseBody).toEqual(questionsWithNewCategory);

      expect(Date.parse(responseBody[0].updated_at)).toBeGreaterThan(
        Date.parse(responseBody[0].created_at),
      );
    });

    test("With new option marked", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.addQuestionsFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const questions = await orchestrator.createQuestions(3, {});
      const questionIds = questions.map((question) => question.id);

      const response = await fetch("http://localhost:3000/api/v1/questions", {
        method: "PATCH",
        headers: {
          Cookie: `session_id=${userSession.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          question_ids: questionIds,
          option_marked: "Sim",
        }),
      });

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      const questionsWithNewCategory = questions.map((question) => {
        return {
          ...question,
          created_at: question.created_at.toISOString(),
          updated_at: responseBody[0].updated_at,
          option_marked: "Sim",
        };
      });

      expect(responseBody).toEqual(questionsWithNewCategory);

      expect(Date.parse(responseBody[0].updated_at)).toBeGreaterThan(
        Date.parse(responseBody[0].created_at),
      );
    });

    test("With new option marked not present in options", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.addQuestionsFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const questions = await orchestrator.createQuestions(3, {
        options: ["red", "blue", "green"],
        optionMarked: "red",
      });
      const questionIds = questions.map((question) => question.id);

      const response = await fetch("http://localhost:3000/api/v1/questions", {
        method: "PATCH",
        headers: {
          Cookie: `session_id=${userSession.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          question_ids: questionIds,
          option_marked: ["Sim"],
        }),
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "A nova opção marcada não está contida as opções possíveis.",
        action:
          "Modifique a opção marcada para uma dentre as opções possíveis.",
        status_code: 400,
      });
    });

    test("With new form section", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.addQuestionsFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const formSection = await orchestrator.createSection(undefined, "form");

      const questions = await orchestrator.createQuestions(3);
      const questionIds = questions.map((question) => question.id);

      const response = await fetch("http://localhost:3000/api/v1/questions", {
        method: "PATCH",
        headers: {
          Cookie: `session_id=${userSession.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          question_ids: questionIds,
          section_id: formSection.id,
        }),
      });

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      const questionsWithNewCategory = questions.map((question) => {
        return {
          ...question,
          created_at: question.created_at.toISOString(),
          updated_at: responseBody[0].updated_at,
          section_id: formSection.id,
        };
      });

      expect(responseBody).toEqual(questionsWithNewCategory);

      expect(Date.parse(responseBody[0].updated_at)).toBeGreaterThan(
        Date.parse(responseBody[0].created_at),
      );
    });

    test("Removing form section", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.addQuestionsFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const formSection = await orchestrator.createSection(undefined, "form");

      const questions = await orchestrator.createQuestions(3, {
        sectionId: formSection.id,
      });
      const questionIds = questions.map((question) => question.id);

      const params = new URLSearchParams();
      params.set("remove_form_section", "");

      const response = await fetch("http://localhost:3000/api/v1/questions", {
        method: "PATCH",
        headers: {
          Cookie: `session_id=${userSession.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          question_ids: questionIds,
        }),
      });

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      const questionsWithNewCategory = questions.map((question) => {
        return {
          ...question,
          created_at: question.created_at.toISOString(),
          updated_at: responseBody[0].updated_at,
          section_id: null,
        };
      });

      expect(responseBody).toEqual(questionsWithNewCategory);

      expect(Date.parse(responseBody[0].updated_at)).toBeGreaterThan(
        Date.parse(responseBody[0].created_at),
      );
    });

    test("With nonexistent form section", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.addQuestionsFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const questions = await orchestrator.createQuestions(3);
      const questionIds = questions.map((question) => question.id);

      const response = await fetch("http://localhost:3000/api/v1/questions", {
        method: "PATCH",
        headers: {
          Cookie: `session_id=${userSession.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          question_ids: questionIds,
          section_id: "cbd746a2-6090-4e1d-9f92-873fca25514d",
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

    test("missing question ids array", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.addQuestionsFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const response = await fetch("http://localhost:3000/api/v1/questions", {
        method: "PATCH",
        headers: {
          Cookie: `session_id=${userSession.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          type: "discursive",
        }),
      });

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual([]);
    });
  });

  describe("Anonymous user", () => {
    test("With valid data", async () => {
      const questions = await orchestrator.createQuestions(3);
      const questionIds = questions.map((question) => question.id);

      const response = await fetch("http://localhost:3000/api/v1/questions", {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          type: "both",
          question_ids: questionIds,
        }),
      });

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "O usuário não possui permissão para executar esta ação.",
        action: 'Verifique se o usuário possui a feature "edit:question".',
        status_code: 403,
      });
    });
  });
});
