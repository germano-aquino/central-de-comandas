import { NotFoundError } from "infra/errors";
import question from "models/question";
import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("DELETE /api/v1/question/[id]", () => {
  describe("Default user", () => {
    test("With valid data", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const question = await orchestrator.createQuestion();

      const response = await fetch(
        `http://localhost:3000/api/v1/questions/${question.id}`,
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
        action: 'Verifique se o usuário possui a feature "delete:question".',
        status_code: 403,
      });
    });
  });

  describe("Allowed user", () => {
    test("With valid data", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.addQuestionsFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const questionToBeDeleted = await orchestrator.createQuestion();

      const response = await fetch(
        `http://localhost:3000/api/v1/questions/${questionToBeDeleted.id}`,
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
        ...questionToBeDeleted,
        created_at: questionToBeDeleted.created_at.toISOString(),
        updated_at: questionToBeDeleted.updated_at.toISOString(),
      });

      //Verify that question doesn't exist on database

      await expect(
        question.findOneValidById(questionToBeDeleted.id),
      ).rejects.toThrow(NotFoundError);
    });

    test("With nonexistent question id", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.addQuestionsFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const nonexistentId = "264b4eff-b94f-4efc-82f9-508a961723ed";
      const response = await fetch(
        `http://localhost:3000/api/v1/questions/${nonexistentId}`,
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
        message: "Pergunta não existe.",
        action: "Verifique se o id da pergunta está correto e tente novamente.",
        status_code: 404,
      });
    });
  });

  describe("Anonymous user", () => {
    test("With valid data", async () => {
      const question = await orchestrator.createQuestion();

      const response = await fetch(
        `http://localhost:3000/api/v1/services/${question.id}`,
        {
          method: "DELETE",
        },
      );

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "O usuário não possui permissão para executar esta ação.",
        action: 'Verifique se o usuário possui a feature "delete:service".',
        status_code: 403,
      });
    });
  });
});
