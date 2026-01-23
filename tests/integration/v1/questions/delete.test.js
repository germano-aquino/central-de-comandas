import { NotFoundError } from "infra/errors";
import question from "models/question";
import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("DELETE /api/v1/question/", () => {
  describe("Default user", () => {
    test("With valid data", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const questions = await orchestrator.createQuestions();
      const questionIds = questions.map((question) => question.id);

      const response = await fetch(`http://localhost:3000/api/v1/questions/`, {
        method: "DELETE",
        headers: {
          Cookie: `session_id=${userSession.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question_ids: questionIds,
        }),
      });

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

      let questionsToBeDeleted = await orchestrator.createQuestions();
      const questionIds = questionsToBeDeleted.map((question) => question.id);

      const response = await fetch(`http://localhost:3000/api/v1/questions`, {
        method: "DELETE",
        headers: {
          Cookie: `session_id=${userSession.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question_ids: questionIds,
        }),
      });

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      questionsToBeDeleted = questionsToBeDeleted.map((question) => {
        return {
          ...question,
          created_at: question.created_at.toISOString(),
          updated_at: question.updated_at.toISOString(),
        };
      });

      expect(responseBody).toEqual(questionsToBeDeleted);

      //Verify that question doesn't exist on database

      questionsToBeDeleted.map(async (questionToBeDeleted) => {
        await expect(
          question.findOneValidById(questionToBeDeleted.id),
        ).rejects.toThrow(NotFoundError);
      });
    });

    test("With nonexistent question id", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      await orchestrator.addQuestionsFeatures(activatedUser);
      const userSession = await orchestrator.createSession(activatedUser);

      const nonexistentQuestionIds = [
        "cbd746a2-6090-4e1d-9f92-873fca25514d",
        "d110e555-ebf2-4acc-ad72-63739372f537",
        "8882cc13-74c3-4170-9420-04077d68c7df",
        "1e806612-ddac-4241-8ae7-cdbabd306b3c",
      ];
      const response = await fetch(`http://localhost:3000/api/v1/questions`, {
        method: "DELETE",
        headers: {
          Cookie: `session_id=${userSession.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question_ids: nonexistentQuestionIds,
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

      const response = await fetch(`http://localhost:3000/api/v1/services`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question_ids: questionIds,
        }),
      });

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
