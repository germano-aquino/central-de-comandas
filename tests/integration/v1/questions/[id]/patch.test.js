import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("PATCH /api/v1/questions/[id]", () => {
  describe("Default user", () => {
    test("With valid data", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const question = await orchestrator.createQuestion();

      const response = await fetch(
        `http://localhost:3000/api/v1/questions/${question.id}`,
        {
          method: "PATCH",
          headers: {
            Cookie: `session_id=${userSession.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            options: ["Sim", "Não", "Talvez"],
          }),
        },
      );

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
    test("With nonexistent question id", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.addQuestionsFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const nonexistentId = "264b4eff-b94f-4efc-82f9-508a961723ed";

      const response = await fetch(
        `http://localhost:3000/api/v1/questions/${nonexistentId}`,
        {
          method: "PATCH",
          headers: {
            Cookie: `session_id=${userSession.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            statement: "Changing to a already in use statement.",
          }),
        },
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "Pergunta não existe.",
        action: "Verifique se o id da pergunta está correto e tente novamente.",
        status_code: 404,
      });
    });

    test("With new statement", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.addQuestionsFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const question = await orchestrator.createQuestion();

      const response = await fetch(
        `http://localhost:3000/api/v1/questions/${question.id}`,
        {
          method: "PATCH",
          headers: {
            Cookie: `session_id=${userSession.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            statement: "Changing to a new valid statement.",
          }),
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      const questionWithNewStatement = {
        ...question,
        created_at: question.created_at.toISOString(),
        updated_at: responseBody.updated_at,
        statement: "Changing to a new valid statement.",
      };

      expect(responseBody).toEqual(questionWithNewStatement);
      expect(Date.parse(responseBody.updated_at)).toBeGreaterThan(
        Date.parse(responseBody.created_at),
      );
    });

    test("With already in use statement", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.addQuestionsFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      await orchestrator.createQuestion(
        "Changing to a already in use statement.",
      );
      const duplicatedQuestion = await orchestrator.createQuestion();

      const response = await fetch(
        `http://localhost:3000/api/v1/questions/${duplicatedQuestion.id}`,
        {
          method: "PATCH",
          headers: {
            Cookie: `session_id=${userSession.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            statement: "Changing to a already in use statement.",
          }),
        },
      );

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Esta pergunta já existe.",
        action: "Reformule a pergunta e tente novamente.",
        status_code: 400,
      });
    });

    test("With new type", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.addQuestionsFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const question = await orchestrator.createQuestion();

      const response = await fetch(
        `http://localhost:3000/api/v1/questions/${question.id}`,
        {
          method: "PATCH",
          headers: {
            Cookie: `session_id=${userSession.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            type: "both",
          }),
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      const questionWithNewType = {
        ...question,
        created_at: question.created_at.toISOString(),
        updated_at: responseBody.updated_at,
        type: "both",
      };

      expect(responseBody).toEqual(questionWithNewType);

      expect(Date.parse(responseBody.updated_at)).toBeGreaterThan(
        Date.parse(responseBody.created_at),
      );
    });

    test("With new type as multiple-choice and missing options", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.addQuestionsFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const question = await orchestrator.createQuestion(
        undefined,
        "discursive",
        [],
      );

      const response = await fetch(
        `http://localhost:3000/api/v1/questions/${question.id}`,
        {
          method: "PATCH",
          headers: {
            Cookie: `session_id=${userSession.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            type: "multiple-choice",
          }),
        },
      );

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message:
          "Este tipo de pergunta necessita de pelo menos duas opções para ser válido.",
        action: "Envie a propriedade 'options' com pelo menos duas opções.",
        status_code: 400,
      });
    });

    test("With new type as multiple-choice and less than 2 options", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.addQuestionsFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const question = await orchestrator.createQuestion(
        undefined,
        "discursive",
      );

      const response = await fetch(
        `http://localhost:3000/api/v1/questions/${question.id}`,
        {
          method: "PATCH",
          headers: {
            Cookie: `session_id=${userSession.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            type: "multiple-choice",
            options: ["Sim"],
          }),
        },
      );

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message:
          "Este tipo de pergunta necessita de pelo menos duas opções para ser válido.",
        action: "Envie a propriedade 'options' com pelo menos duas opções.",
        status_code: 400,
      });
    });

    test("With new options", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.addQuestionsFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const question = await orchestrator.createQuestion();

      const response = await fetch(
        `http://localhost:3000/api/v1/questions/${question.id}`,
        {
          method: "PATCH",
          headers: {
            Cookie: `session_id=${userSession.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            options: ["green", "blue", "red"],
          }),
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      const questionsWithNewOptions = {
        ...question,
        created_at: question.created_at.toISOString(),
        updated_at: responseBody.updated_at,
        options: ["green", "blue", "red"],
      };

      expect(responseBody).toEqual(questionsWithNewOptions);

      expect(Date.parse(responseBody.updated_at)).toBeGreaterThan(
        Date.parse(responseBody.created_at),
      );
    });

    test("With less than 2 options", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.addQuestionsFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const question = await orchestrator.createQuestion();

      const response = await fetch(
        `http://localhost:3000/api/v1/questions/${question.id}`,
        {
          method: "PATCH",
          headers: {
            Cookie: `session_id=${userSession.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            options: ["Sim"],
          }),
        },
      );

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message:
          "Este tipo de pergunta necessita de pelo menos duas opções para ser válido.",
        action: "Envie a propriedade 'options' com pelo menos duas opções.",
        status_code: 400,
      });
    });

    test("With new options and removing option marked from possible options", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.addQuestionsFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const question = await orchestrator.createQuestion(
        undefined,
        undefined,
        ["red", "blue", "green"],
        undefined,
        "red",
      );

      const response = await fetch(
        `http://localhost:3000/api/v1/questions/${question.id}`,
        {
          method: "PATCH",
          headers: {
            Cookie: `session_id=${userSession.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            options: ["Sim", "Não"],
          }),
        },
      );

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

      const question = await orchestrator.createQuestion(
        undefined,
        "discursive",
      );

      const response = await fetch(
        `http://localhost:3000/api/v1/questions/${question.id}`,
        {
          method: "PATCH",
          headers: {
            Cookie: `session_id=${userSession.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            answer: "Creating new answer.",
          }),
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      const questionWithNewAndwer = {
        ...question,
        created_at: question.created_at.toISOString(),
        updated_at: responseBody.updated_at,
        answer: "Creating new answer.",
      };

      expect(responseBody).toEqual(questionWithNewAndwer);

      expect(Date.parse(responseBody.updated_at)).toBeGreaterThan(
        Date.parse(responseBody.created_at),
      );
    });

    test("With new option marked", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.addQuestionsFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const question = await orchestrator.createQuestion();

      const response = await fetch(
        `http://localhost:3000/api/v1/questions/${question.id}`,
        {
          method: "PATCH",
          headers: {
            Cookie: `session_id=${userSession.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            option_marked: "Sim",
          }),
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      const questionWithNewOptionMarked = {
        ...question,
        created_at: question.created_at.toISOString(),
        updated_at: responseBody.updated_at,
        option_marked: "Sim",
      };

      expect(responseBody).toEqual(questionWithNewOptionMarked);

      expect(Date.parse(responseBody.updated_at)).toBeGreaterThan(
        Date.parse(responseBody.created_at),
      );
    });

    test("With new option marked not present in options", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.addQuestionsFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const question = await orchestrator.createQuestion(
        undefined,
        undefined,
        ["red", "blue", "green"],
        undefined,
        "red",
      );

      const response = await fetch(
        `http://localhost:3000/api/v1/questions/${question.id}`,
        {
          method: "PATCH",
          headers: {
            Cookie: `session_id=${userSession.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            option_marked: ["Sim"],
          }),
        },
      );

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

      const question = await orchestrator.createQuestion();

      const response = await fetch(
        `http://localhost:3000/api/v1/questions/${question.id}`,
        {
          method: "PATCH",
          headers: {
            Cookie: `session_id=${userSession.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            section_id: formSection.id,
          }),
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      const questionWithNewFormSection = {
        ...question,
        created_at: question.created_at.toISOString(),
        updated_at: responseBody.updated_at,
        section_id: formSection.id,
      };

      expect(responseBody).toEqual(questionWithNewFormSection);

      expect(Date.parse(responseBody.updated_at)).toBeGreaterThan(
        Date.parse(responseBody.created_at),
      );
    });

    test("Removing form section", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.addQuestionsFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const formSection = await orchestrator.createSection(undefined, "form");

      const question = await orchestrator.createQuestion(
        undefined,
        undefined,
        undefined,
        formSection.id,
      );

      const params = new URLSearchParams();
      params.set("remove_form_section", "");

      const response = await fetch(
        `http://localhost:3000/api/v1/questions/${question.id}?${params}`,
        {
          method: "PATCH",
          headers: {
            Cookie: `session_id=${userSession.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({}),
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      const questionWithoutFormSection = {
        ...question,
        created_at: question.created_at.toISOString(),
        updated_at: responseBody.updated_at,
        section_id: null,
      };

      expect(responseBody).toEqual(questionWithoutFormSection);

      expect(Date.parse(responseBody.updated_at)).toBeGreaterThan(
        Date.parse(responseBody.created_at),
      );
    });

    test("With nonexistent form section", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.addQuestionsFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const question = await orchestrator.createQuestion();

      const response = await fetch(
        `http://localhost:3000/api/v1/questions/${question.id}`,
        {
          method: "PATCH",
          headers: {
            Cookie: `session_id=${userSession.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            section_id: "cbd746a2-6090-4e1d-9f92-873fca25514d",
          }),
        },
      );

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Esta seção não existe.",
        action: "Verifique o id da seção e tente novamente.",
        status_code: 400,
      });
    });
  });

  describe("Anonymous user", () => {
    test("With valid data", async () => {
      const question = await orchestrator.createQuestion();

      const response = await fetch(
        `http://localhost:3000/api/v1/questions/${question.id}`,
        {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            type: "both",
          }),
        },
      );

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
