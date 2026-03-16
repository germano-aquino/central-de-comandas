import question from "@/models/question";
import orchestrator from "tests/orchestrator";

import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/questions", () => {
  describe("Default user", () => {
    test("With valid data", async () => {
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
    describe("Radio type", () => {
      test("With required data", async () => {
        const loggedUser = await orchestrator.createLoggedUser();
        await orchestrator.addFeatures(loggedUser, question.addFeatures);

        const response = await fetch("http://localhost:3000/api/v1/questions", {
          method: "POST",
          headers: {
            Cookie: `session_id=${loggedUser.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            statement: "What is your life purpose?",
            type: "radio",
            options: ["42", "Live"],
          }),
        });

        expect(response.status).toBe(201);

        const responseBody = await response.json();

        expect(responseBody.statement).toBe("What is your life purpose?");
        expect(responseBody.type).toBe("radio");
        expect(responseBody.options).toEqual(["42", "Live"]);
        expect(responseBody.options_marked).toEqual([]);
        expect(responseBody.answer).toBeNull();
        expect(responseBody.is_mold).toBe(false);
        expect(uuidVersion(responseBody.id)).toBe(4);
        expect(Date.parse(responseBody.created_at)).not.toBeNaN();
        expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      });

      test("With required data and form section", async () => {
        const loggedUser = await orchestrator.createLoggedUser();
        await orchestrator.addFeatures(loggedUser, question.addFeatures);

        const formSection = await orchestrator.createSection(
          "Brazilian Waxing",
          "form",
        );

        const response = await fetch("http://localhost:3000/api/v1/questions", {
          method: "POST",
          headers: {
            Cookie: `session_id=${loggedUser.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            statement: "What type of wax was used?",
            type: "radio",
            options: ["Açaí", "Aveia", "Castanha", "Cupuaçu"],
            section_id: formSection.id,
          }),
        });

        expect(response.status).toBe(201);

        const responseBody = await response.json();

        expect(responseBody.statement).toBe("What type of wax was used?");
        expect(responseBody.type).toBe("radio");
        expect(responseBody.options).toEqual([
          "Açaí",
          "Aveia",
          "Castanha",
          "Cupuaçu",
        ]);
        expect(responseBody.section_id).toBe(formSection.id);
        expect(responseBody.options_marked).toEqual([]);
        expect(responseBody.answer).toBeNull();
        expect(responseBody.is_mold).toBe(false);
        expect(uuidVersion(responseBody.id)).toBe(4);
        expect(Date.parse(responseBody.created_at)).not.toBeNaN();
        expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      });

      test("With required data and nonexistent form section", async () => {
        const loggedUser = await orchestrator.createLoggedUser();
        await orchestrator.addFeatures(loggedUser, question.addFeatures);

        const response = await fetch("http://localhost:3000/api/v1/questions", {
          method: "POST",
          headers: {
            Cookie: `session_id=${loggedUser.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            statement: "Skin type:",
            type: "radio",
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
        const loggedUser = await orchestrator.createLoggedUser();
        await orchestrator.addFeatures(loggedUser, question.addFeatures);

        const response = await fetch("http://localhost:3000/api/v1/questions", {
          method: "POST",
          headers: {
            Cookie: `session_id=${loggedUser.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            statement: "What type of wax was used?",
            type: "radio",
            options: ["Mint", "Chocco", "Avocado", "Banana"],
          }),
        });

        expect(response.status).toBe(201);

        const responseBody = await response.json();

        expect(responseBody.statement).toBe("What type of wax was used?");
        expect(responseBody.type).toBe("radio");
        expect(responseBody.options).toEqual([
          "Mint",
          "Chocco",
          "Avocado",
          "Banana",
        ]);
        expect(responseBody.section_id).toBeNull();
        expect(responseBody.options_marked).toEqual([]);
        expect(responseBody.answer).toBeNull();
        expect(responseBody.is_mold).toBe(false);
        expect(uuidVersion(responseBody.id)).toBe(4);
        expect(Date.parse(responseBody.created_at)).not.toBeNaN();
        expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      });

      test("With invalid type", async () => {
        const loggedUser = await orchestrator.createLoggedUser();
        await orchestrator.addFeatures(loggedUser, question.addFeatures);

        const response = await fetch("http://localhost:3000/api/v1/questions", {
          method: "POST",
          headers: {
            Cookie: `session_id=${loggedUser.token}`,
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
        const loggedUser = await orchestrator.createLoggedUser();
        await orchestrator.addFeatures(loggedUser, question.addFeatures);

        const response = await fetch("http://localhost:3000/api/v1/questions", {
          method: "POST",
          headers: {
            Cookie: `session_id=${loggedUser.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            type: "radio",
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
        const loggedUser = await orchestrator.createLoggedUser();
        await orchestrator.addFeatures(loggedUser, question.addFeatures);

        const response = await fetch("http://localhost:3000/api/v1/questions", {
          method: "POST",
          headers: {
            Cookie: `session_id=${loggedUser.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            statement: "",
            type: "radio",
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
        const loggedUser = await orchestrator.createLoggedUser();
        await orchestrator.addFeatures(loggedUser, question.addFeatures);

        const response = await fetch("http://localhost:3000/api/v1/questions", {
          method: "POST",
          headers: {
            Cookie: `session_id=${loggedUser.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            statement: "Missing options test:",
            type: "radio",
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
        const loggedUser = await orchestrator.createLoggedUser();
        await orchestrator.addFeatures(loggedUser, question.addFeatures);

        const response = await fetch("http://localhost:3000/api/v1/questions", {
          method: "POST",
          headers: {
            Cookie: `session_id=${loggedUser.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            statement: "Only one option test:",
            type: "radio",
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
        const loggedUser = await orchestrator.createLoggedUser();
        await orchestrator.addFeatures(loggedUser, question.addFeatures);

        const response = await fetch("http://localhost:3000/api/v1/questions", {
          method: "POST",
          headers: {
            Cookie: `session_id=${loggedUser.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            statement: "Marked Option is not included on options:",
            type: "radio",
            options: ["right", "left"],
            options_marked: ["theft"],
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

      test("With more than one option marked", async () => {
        const loggedUser = await orchestrator.createLoggedUser();
        await orchestrator.addFeatures(loggedUser, question.addFeatures);

        const response = await fetch("http://localhost:3000/api/v1/questions", {
          method: "POST",
          headers: {
            Cookie: `session_id=${loggedUser.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            statement: "More than one option marked:",
            type: "radio",
            options: ["right", "left"],
            options_marked: ["right", "left"],
          }),
        });

        expect(response.status).toBe(400);

        const responseBody = await response.json();

        expect(responseBody).toEqual({
          name: "ValidationError",
          message:
            "Só é permitido uma única opção marcada para a pergunta do tipo radio.",
          action:
            "Modifique a opção marcada para que tenha só uma opção possível.",
          status_code: 400,
        });
      });

      test("With required data and is mold property", async () => {
        const loggedUser = await orchestrator.createLoggedUser();
        await orchestrator.addFeatures(loggedUser, question.addFeatures);

        const response = await fetch("http://localhost:3000/api/v1/questions", {
          method: "POST",
          headers: {
            Cookie: `session_id=${loggedUser.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            statement: "Is mold question",
            type: "radio",
            options: ["right", "left"],
            options_marked: ["left"],
            is_mold: true,
          }),
        });

        expect(response.status).toBe(201);

        const responseBody = await response.json();

        expect(responseBody.statement).toBe("Is mold question");
        expect(responseBody.type).toBe("radio");
        expect(responseBody.options).toEqual(["right", "left"]);
        expect(responseBody.section_id).toBeNull();
        expect(responseBody.options_marked).toEqual(["left"]);
        expect(responseBody.answer).toBeNull();
        expect(responseBody.is_mold).toBe(true);
        expect(uuidVersion(responseBody.id)).toBe(4);
        expect(Date.parse(responseBody.created_at)).not.toBeNaN();
        expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      });
    });

    describe("Checkbox type", () => {
      test("With required data", async () => {
        const loggedUser = await orchestrator.createLoggedUser();
        await orchestrator.addFeatures(loggedUser, question.addFeatures);

        const response = await fetch("http://localhost:3000/api/v1/questions", {
          method: "POST",
          headers: {
            Cookie: `session_id=${loggedUser.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            statement: "What is your favourite music genre?",
            type: "checkBox",
            options: ["country", "rock"],
          }),
        });

        expect(response.status).toBe(201);

        const responseBody = await response.json();

        expect(responseBody.statement).toBe(
          "What is your favourite music genre?",
        );
        expect(responseBody.type).toBe("checkBox");
        expect(responseBody.options).toEqual(["country", "rock"]);
        expect(responseBody.options_marked).toEqual([]);
        expect(responseBody.answer).toBeNull();
        expect(responseBody.is_mold).toBe(false);
        expect(uuidVersion(responseBody.id)).toBe(4);
        expect(Date.parse(responseBody.created_at)).not.toBeNaN();
        expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      });

      test("With required data and form section", async () => {
        const loggedUser = await orchestrator.createLoggedUser();
        await orchestrator.addFeatures(loggedUser, question.addFeatures);

        const formSection = await orchestrator.createSection(
          "Coffee Type",
          "form",
        );

        const response = await fetch("http://localhost:3000/api/v1/questions", {
          method: "POST",
          headers: {
            Cookie: `session_id=${loggedUser.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            statement: "What type of coffee was used?",
            type: "checkBox",
            options: ["Brazilian", "Indian", "Arabic", "Persian"],
            section_id: formSection.id,
          }),
        });

        expect(response.status).toBe(201);

        const responseBody = await response.json();

        expect(responseBody.statement).toBe("What type of coffee was used?");
        expect(responseBody.type).toBe("checkBox");
        expect(responseBody.options).toEqual([
          "Brazilian",
          "Indian",
          "Arabic",
          "Persian",
        ]);
        expect(responseBody.section_id).toBe(formSection.id);
        expect(responseBody.options_marked).toEqual([]);
        expect(responseBody.answer).toBeNull();
        expect(responseBody.is_mold).toBe(false);
        expect(uuidVersion(responseBody.id)).toBe(4);
        expect(Date.parse(responseBody.created_at)).not.toBeNaN();
        expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      });
    });

    describe("YesOrNo type", () => {
      test("With required data", async () => {
        const loggedUser = await orchestrator.createLoggedUser();
        await orchestrator.addFeatures(loggedUser, question.addFeatures);

        const response = await fetch("http://localhost:3000/api/v1/questions", {
          method: "POST",
          headers: {
            Cookie: `session_id=${loggedUser.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            statement: "Is it your first time?",
            type: "yesOrNo",
          }),
        });

        expect(response.status).toBe(201);

        const responseBody = await response.json();

        expect(responseBody.statement).toBe("Is it your first time?");
        expect(responseBody.type).toBe("yesOrNo");
        expect(responseBody.options).toEqual(["Não", "Sim"]);
        expect(responseBody.options_marked).toEqual([]);
        expect(responseBody.answer).toBeNull();
        expect(responseBody.is_mold).toBe(false);
        expect(uuidVersion(responseBody.id)).toBe(4);
        expect(Date.parse(responseBody.created_at)).not.toBeNaN();
        expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      });

      test("With required data and form section", async () => {
        const loggedUser = await orchestrator.createLoggedUser();
        await orchestrator.addFeatures(loggedUser, question.addFeatures);

        const formSection = await orchestrator.createSection(
          "Harry Potter",
          "form",
        );

        const response = await fetch("http://localhost:3000/api/v1/questions", {
          method: "POST",
          headers: {
            Cookie: `session_id=${loggedUser.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            statement: "Are you a witch?",
            type: "yesOrNo",
            options: ["Yes", "No"],
            section_id: formSection.id,
          }),
        });

        expect(response.status).toBe(201);

        const responseBody = await response.json();

        expect(responseBody.statement).toBe("Are you a witch?");
        expect(responseBody.type).toBe("yesOrNo");
        expect(responseBody.options).toEqual(["Não", "Sim"]);
        expect(responseBody.section_id).toBe(formSection.id);
        expect(responseBody.options_marked).toEqual([]);
        expect(responseBody.answer).toBeNull();
        expect(responseBody.is_mold).toBe(false);
        expect(uuidVersion(responseBody.id)).toBe(4);
        expect(Date.parse(responseBody.created_at)).not.toBeNaN();
        expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      });
    });

    describe("YesOrNoDiscursive type", () => {
      test("With required data", async () => {
        const loggedUser = await orchestrator.createLoggedUser();
        await orchestrator.addFeatures(loggedUser, question.addFeatures);

        const response = await fetch("http://localhost:3000/api/v1/questions", {
          method: "POST",
          headers: {
            Cookie: `session_id=${loggedUser.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            statement: "What is your favorite vacation style?",
            type: "yesOrNoDiscursive",
            options: ["EcoTurism", "Gastronomic"],
          }),
        });

        expect(response.status).toBe(201);

        const responseBody = await response.json();

        expect(responseBody.statement).toBe(
          "What is your favorite vacation style?",
        );
        expect(responseBody.type).toBe("yesOrNoDiscursive");
        expect(responseBody.options).toEqual(["Não", "Sim"]);
        expect(responseBody.options_marked).toEqual([]);
        expect(responseBody.answer).toBeNull();
        expect(responseBody.is_mold).toBe(false);
        expect(uuidVersion(responseBody.id)).toBe(4);
        expect(Date.parse(responseBody.created_at)).not.toBeNaN();
        expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      });

      test("With required data and form section", async () => {
        const loggedUser = await orchestrator.createLoggedUser();
        await orchestrator.addFeatures(loggedUser, question.addFeatures);

        const formSection = await orchestrator.createSection("Brow", "form");

        const response = await fetch("http://localhost:3000/api/v1/questions", {
          method: "POST",
          headers: {
            Cookie: `session_id=${loggedUser.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            statement: "Do you use acid on your face?",
            type: "yesOrNoDiscursive",
            options: ["Yes", "No"],
            section_id: formSection.id,
            is_mold: true,
          }),
        });

        expect(response.status).toBe(201);

        const responseBody = await response.json();

        expect(responseBody.statement).toBe("Do you use acid on your face?");
        expect(responseBody.type).toBe("yesOrNoDiscursive");
        expect(responseBody.options).toEqual(["Não", "Sim"]);
        expect(responseBody.section_id).toBe(formSection.id);
        expect(responseBody.options_marked).toEqual([]);
        expect(responseBody.answer).toBeNull();
        expect(responseBody.is_mold).toBe(true);
        expect(uuidVersion(responseBody.id)).toBe(4);
        expect(Date.parse(responseBody.created_at)).not.toBeNaN();
        expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      });
    });

    describe("Discursive type", () => {
      test("With required data", async () => {
        const loggedUser = await orchestrator.createLoggedUser();
        await orchestrator.addFeatures(loggedUser, question.addFeatures);

        const response = await fetch("http://localhost:3000/api/v1/questions", {
          method: "POST",
          headers: {
            Cookie: `session_id=${loggedUser.token}`,
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
        expect(responseBody.options_marked).toEqual([]);
        expect(responseBody.answer).toBeNull();
        expect(responseBody.is_mold).toBe(false);
        expect(uuidVersion(responseBody.id)).toBe(4);
        expect(Date.parse(responseBody.created_at)).not.toBeNaN();
        expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      });

      test("With required data and form section", async () => {
        const loggedUser = await orchestrator.createLoggedUser();
        await orchestrator.addFeatures(loggedUser, question.addFeatures);

        const formSection = await orchestrator.createSection(
          "High Frequency",
          "form",
        );

        const response = await fetch("http://localhost:3000/api/v1/questions", {
          method: "POST",
          headers: {
            Cookie: `session_id=${loggedUser.token}`,
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
        expect(responseBody.options_marked).toEqual([]);
        expect(responseBody.answer).toBeNull();
        expect(responseBody.is_mold).toBe(false);
        expect(uuidVersion(responseBody.id)).toBe(4);
        expect(Date.parse(responseBody.created_at)).not.toBeNaN();
        expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      });

      test("With required data and is mold property", async () => {
        const loggedUser = await orchestrator.createLoggedUser();
        await orchestrator.addFeatures(loggedUser, question.addFeatures);

        const response = await fetch("http://localhost:3000/api/v1/questions", {
          method: "POST",
          headers: {
            Cookie: `session_id=${loggedUser.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            statement: "Do you have any health condition?",
            type: "discursive",
            answer: "Yes I do.",
            is_mold: true,
          }),
        });

        expect(response.status).toBe(201);

        const responseBody = await response.json();

        expect(responseBody.statement).toBe(
          "Do you have any health condition?",
        );
        expect(responseBody.type).toBe("discursive");
        expect(responseBody.options).toEqual([]);
        expect(responseBody.options_marked).toEqual([]);
        expect(responseBody.answer).toBe("Yes I do.");
        expect(responseBody.is_mold).toBe(true);
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
          type: "radio",
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
