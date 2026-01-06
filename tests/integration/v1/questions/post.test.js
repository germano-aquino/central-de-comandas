import orchestrator from "tests/orchestrator";

import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/questions", () => {
  describe("Default user", () => {
    test("Without permission and valida data", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const response = await fetch("http://localhost:3000/api/v1/questions", {
        method: "POST",
        headers: {
          Cookie: `session_id=${userSession.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          statement: "What is your life purpose?",
          type: "multiple-choice",
          options: ["42", "Live"],
        }),
      });

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "O usuário não possui permissão para executar esta ação.",
        action: 'Verifique se o usuário possui a feature "create:question".',
        status_code: 403,
      });
    });
  });

  describe("Allowed user", () => {
    describe("Multiple choice type", () => {
      test("With required data", async () => {
        const inactiveUser = await orchestrator.createUser();
        const activatedUser = await orchestrator.activateUser(inactiveUser);
        await orchestrator.addQuestionsFeatures(activatedUser);
        const userSession = await orchestrator.createSession(activatedUser);

        const response = await fetch("http://localhost:3000/api/v1/questions", {
          method: "POST",
          headers: {
            Cookie: `session_id=${userSession.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            statement: "What is your life purpose?",
            type: "multiple-choice",
            options: ["42", "Live"],
          }),
        });

        expect(response.status).toBe(201);

        const responseBody = await response.json();

        expect(responseBody.statement).toBe("What is your life purpose?");
        expect(responseBody.type).toBe("multiple-choice");
        expect(responseBody.options).toEqual(["42", "Live"]);
        expect(responseBody.option_marked).toBeNull();
        expect(responseBody.answer).toBeNull();
        expect(uuidVersion(responseBody.id)).toBe(4);
        expect(Date.parse(responseBody.created_at)).not.toBeNaN();
        expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      });

      test("With required data and form section", async () => {
        const inactiveUser = await orchestrator.createUser();
        const activatedUser = await orchestrator.activateUser(inactiveUser);
        await orchestrator.addQuestionsFeatures(activatedUser);
        const userSession = await orchestrator.createSession(activatedUser);

        const formSection = await orchestrator.createSection(
          "Brazilian Waxing",
          "form",
        );

        const response = await fetch("http://localhost:3000/api/v1/questions", {
          method: "POST",
          headers: {
            Cookie: `session_id=${userSession.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            statement: "What type of wax was used?",
            type: "multiple-choice",
            options: ["Açaí", "Aveia", "Castanha", "Cupuaçu"],
            section_id: formSection.id,
          }),
        });

        expect(response.status).toBe(201);

        const responseBody = await response.json();

        expect(responseBody.statement).toBe("What type of wax was used?");
        expect(responseBody.type).toBe("multiple-choice");
        expect(responseBody.options).toEqual([
          "Açaí",
          "Aveia",
          "Castanha",
          "Cupuaçu",
        ]);
        expect(responseBody.section_id).toBe(formSection.id);
        expect(responseBody.option_marked).toBeNull();
        expect(responseBody.answer).toBeNull();
        expect(uuidVersion(responseBody.id)).toBe(4);
        expect(Date.parse(responseBody.created_at)).not.toBeNaN();
        expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      });

      test("With required data and nonexistent category", async () => {
        const inactiveUser = await orchestrator.createUser();
        const activatedUser = await orchestrator.activateUser(inactiveUser);
        await orchestrator.addQuestionsFeatures(activatedUser);
        const userSession = await orchestrator.createSession(activatedUser);

        const response = await fetch("http://localhost:3000/api/v1/questions", {
          method: "POST",
          headers: {
            Cookie: `session_id=${userSession.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            statement: "Skin type:",
            type: "multiple-choice",
            options: ["Sensitive", "Dry", "Very Dry"],
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

      test("With required data and duplicated statement", async () => {
        const inactiveUser = await orchestrator.createUser();
        const activatedUser = await orchestrator.activateUser(inactiveUser);
        await orchestrator.addQuestionsFeatures(activatedUser);
        const userSession = await orchestrator.createSession(activatedUser);

        const response = await fetch("http://localhost:3000/api/v1/questions", {
          method: "POST",
          headers: {
            Cookie: `session_id=${userSession.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            statement: "What type of wax was used?",
            type: "multiple-choice",
            options: ["Mint", "Chocco", "Avocado", "Banana"],
          }),
        });

        expect(response.status).toBe(400);

        const responseBody = await response.json();

        expect(responseBody).toEqual({
          name: "ValidationError",
          message: "Esta pergunta já existe.",
          action: "Reformule a pergunta e tente novamente.",
          status_code: 400,
        });
      });

      test("With invalid type", async () => {
        const inactiveUser = await orchestrator.createUser();
        const activatedUser = await orchestrator.activateUser(inactiveUser);
        await orchestrator.addQuestionsFeatures(activatedUser);
        const userSession = await orchestrator.createSession(activatedUser);

        const response = await fetch("http://localhost:3000/api/v1/questions", {
          method: "POST",
          headers: {
            Cookie: `session_id=${userSession.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            statement: "Ivalid Type",
            type: "invalidType",
          }),
        });

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

      test("Missing statement property", async () => {
        const inactiveUser = await orchestrator.createUser();
        const activatedUser = await orchestrator.activateUser(inactiveUser);
        await orchestrator.addQuestionsFeatures(activatedUser);
        const userSession = await orchestrator.createSession(activatedUser);

        const response = await fetch("http://localhost:3000/api/v1/questions", {
          method: "POST",
          headers: {
            Cookie: `session_id=${userSession.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            type: "multiple-choice",
            options: ["Mint", "Chocco", "Avocado", "Banana"],
          }),
        });

        expect(response.status).toBe(400);

        const responseBody = await response.json();

        expect(responseBody).toEqual({
          name: "ValidationError",
          message: "Campo de pergunta está inválido.",
          action:
            "Verifique se o campo de pergunta está correto e tente novamente.",
          status_code: 400,
        });
      });

      test("Empty statement property", async () => {
        const inactiveUser = await orchestrator.createUser();
        const activatedUser = await orchestrator.activateUser(inactiveUser);
        await orchestrator.addQuestionsFeatures(activatedUser);
        const userSession = await orchestrator.createSession(activatedUser);

        const response = await fetch("http://localhost:3000/api/v1/questions", {
          method: "POST",
          headers: {
            Cookie: `session_id=${userSession.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            statement: "",
            type: "multiple-choice",
            options: ["Mint", "Chocco", "Avocado", "Banana"],
          }),
        });

        expect(response.status).toBe(400);

        const responseBody = await response.json();

        expect(responseBody).toEqual({
          name: "ValidationError",
          message: "Campo de pergunta está inválido.",
          action:
            "Verifique se o campo de pergunta está correto e tente novamente.",
          status_code: 400,
        });
      });

      test("Missing options property", async () => {
        const inactiveUser = await orchestrator.createUser();
        const activatedUser = await orchestrator.activateUser(inactiveUser);
        await orchestrator.addQuestionsFeatures(activatedUser);
        const userSession = await orchestrator.createSession(activatedUser);

        const response = await fetch("http://localhost:3000/api/v1/questions", {
          method: "POST",
          headers: {
            Cookie: `session_id=${userSession.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            statement: "Missing options test:",
            type: "multiple-choice",
          }),
        });

        expect(response.status).toBe(400);

        const responseBody = await response.json();

        expect(responseBody).toEqual({
          name: "ValidationError",
          message: "Campo de opções está inválido.",
          action: "Insira pelo menos duas opções e tente novamente.",
          status_code: 400,
        });
      });

      test("Not enough options", async () => {
        const inactiveUser = await orchestrator.createUser();
        const activatedUser = await orchestrator.activateUser(inactiveUser);
        await orchestrator.addQuestionsFeatures(activatedUser);
        const userSession = await orchestrator.createSession(activatedUser);

        const response = await fetch("http://localhost:3000/api/v1/questions", {
          method: "POST",
          headers: {
            Cookie: `session_id=${userSession.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            statement: "Only one option test:",
            type: "multiple-choice",
            options: ["One option"],
          }),
        });

        expect(response.status).toBe(400);

        const responseBody = await response.json();

        expect(responseBody).toEqual({
          name: "ValidationError",
          message: "Campo de opções está inválido.",
          action: "Insira pelo menos duas opções e tente novamente.",
          status_code: 400,
        });
      });

      test("Option marked is not included on options", async () => {
        const inactiveUser = await orchestrator.createUser();
        const activatedUser = await orchestrator.activateUser(inactiveUser);
        await orchestrator.addQuestionsFeatures(activatedUser);
        const userSession = await orchestrator.createSession(activatedUser);

        const response = await fetch("http://localhost:3000/api/v1/questions", {
          method: "POST",
          headers: {
            Cookie: `session_id=${userSession.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            statement: "Marked Option is not included on options:",
            type: "multiple-choice",
            options: ["right", "left"],
            option_marked: ["left"],
          }),
        });

        expect(response.status).toBe(400);

        const responseBody = await response.json();

        expect(responseBody).toEqual({
          name: "ValidationError",
          message: "Opção marcada inválida.",
          action:
            "Verifique se a opção marcada está presente nas opções possíveis.",
          status_code: 400,
        });
      });
    });

    describe("Discursive type", () => {
      test("With required data", async () => {
        const inactiveUser = await orchestrator.createUser();
        const activatedUser = await orchestrator.activateUser(inactiveUser);
        await orchestrator.addQuestionsFeatures(activatedUser);
        const userSession = await orchestrator.createSession(activatedUser);

        const response = await fetch("http://localhost:3000/api/v1/questions", {
          method: "POST",
          headers: {
            Cookie: `session_id=${userSession.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            statement: "What is your favorite color?",
            type: "discursive",
          }),
        });

        expect(response.status).toBe(201);

        const responseBody = await response.json();

        expect(responseBody.statement).toBe("What is your favorite color?");
        expect(responseBody.type).toBe("discursive");
        expect(responseBody.options).toEqual([]);
        expect(responseBody.option_marked).toBeNull();
        expect(responseBody.answer).toBeNull();
        expect(uuidVersion(responseBody.id)).toBe(4);
        expect(Date.parse(responseBody.created_at)).not.toBeNaN();
        expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      });

      test("With required data and form section", async () => {
        const inactiveUser = await orchestrator.createUser();
        const activatedUser = await orchestrator.activateUser(inactiveUser);
        await orchestrator.addQuestionsFeatures(activatedUser);
        const userSession = await orchestrator.createSession(activatedUser);

        const formSection = await orchestrator.createSection(
          "High Frequency",
          "form",
        );

        const response = await fetch("http://localhost:3000/api/v1/questions", {
          method: "POST",
          headers: {
            Cookie: `session_id=${userSession.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            statement: "Do you have any health condition?",
            type: "discursive",
            section_id: formSection.id,
          }),
        });

        expect(response.status).toBe(201);

        const responseBody = await response.json();

        expect(responseBody.statement).toBe(
          "Do you have any health condition?",
        );
        expect(responseBody.type).toBe("discursive");
        expect(responseBody.options).toEqual([]);
        expect(responseBody.section_id).toBe(formSection.id);
        expect(responseBody.option_marked).toBeNull();
        expect(responseBody.answer).toBeNull();
        expect(uuidVersion(responseBody.id)).toBe(4);
        expect(Date.parse(responseBody.created_at)).not.toBeNaN();
        expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      });
    });

    describe("Both type", () => {
      test("With required data", async () => {
        const inactiveUser = await orchestrator.createUser();
        const activatedUser = await orchestrator.activateUser(inactiveUser);
        await orchestrator.addQuestionsFeatures(activatedUser);
        const userSession = await orchestrator.createSession(activatedUser);

        const response = await fetch("http://localhost:3000/api/v1/questions", {
          method: "POST",
          headers: {
            Cookie: `session_id=${userSession.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            statement: "What is your favorite vacation style?",
            type: "both",
            options: ["EcoTurism", "Gastronomic"],
          }),
        });

        expect(response.status).toBe(201);

        const responseBody = await response.json();

        expect(responseBody.statement).toBe(
          "What is your favorite vacation style?",
        );
        expect(responseBody.type).toBe("both");
        expect(responseBody.options).toEqual(["EcoTurism", "Gastronomic"]);
        expect(responseBody.option_marked).toBeNull();
        expect(responseBody.answer).toBeNull();
        expect(uuidVersion(responseBody.id)).toBe(4);
        expect(Date.parse(responseBody.created_at)).not.toBeNaN();
        expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      });

      test("With required data and form section", async () => {
        const inactiveUser = await orchestrator.createUser();
        const activatedUser = await orchestrator.activateUser(inactiveUser);
        await orchestrator.addQuestionsFeatures(activatedUser);
        const userSession = await orchestrator.createSession(activatedUser);

        const formSection = await orchestrator.createSection("Brow", "form");

        const response = await fetch("http://localhost:3000/api/v1/questions", {
          method: "POST",
          headers: {
            Cookie: `session_id=${userSession.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            statement: "Do you use acid on your face?",
            type: "both",
            options: ["Yes", "No"],
            section_id: formSection.id,
          }),
        });

        expect(response.status).toBe(201);

        const responseBody = await response.json();

        expect(responseBody.statement).toBe("Do you use acid on your face?");
        expect(responseBody.type).toBe("both");
        expect(responseBody.options).toEqual(["Yes", "No"]);
        expect(responseBody.section_id).toBe(formSection.id);
        expect(responseBody.option_marked).toBeNull();
        expect(responseBody.answer).toBeNull();
        expect(uuidVersion(responseBody.id)).toBe(4);
        expect(Date.parse(responseBody.created_at)).not.toBeNaN();
        expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      });
    });
  });

  describe("Anonymous user", () => {
    test("With valid data", async () => {
      const response = await fetch("http://localhost:3000/api/v1/questions", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          statement: "What is your job?",
          type: "multiple-choice",
          options: ["Programmer", "Aura Farmer"],
        }),
      });

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "O usuário não possui permissão para executar esta ação.",
        action: 'Verifique se o usuário possui a feature "create:question".',
        status_code: 403,
      });
    });
  });
});
