import activation from "models/activation";
import user from "models/user";
import orchestrator from "tests/orchestrator";

import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("PATCH /api/v1/activation/[token_id]", () => {
  describe("Anonymous user", () => {
    test("With nonexistent token", async () => {
      const nonexistentToken = "264b4eff-b94f-4efc-82f9-508a961723ed";

      const response = await fetch(
        `http://localhost:3000/api/v1/activation/${nonexistentToken}`,
        {
          method: "PATCH",
        },
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        message:
          "O token de ativação deste usuário não existe ou está expirado.",
        action: "Solicite o reenvio do email de ativação.",
        status_code: 404,
      });
    });

    test("With expired token", async () => {
      jest.useFakeTimers({
        now: new Date(Date.now() - activation.EXPIRATION_IN_MILLISECONDS),
      });

      const createdUser = await orchestrator.createUser();

      const expiredToken = await activation.create(createdUser);

      jest.useRealTimers();

      const response = await fetch(
        `http://localhost:3000/api/v1/activation/${expiredToken.id}`,
        {
          method: "PATCH",
        },
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        message:
          "O token de ativação deste usuário não existe ou está expirado.",
        action: "Solicite o reenvio do email de ativação.",
        status_code: 404,
      });
    });

    test("With already used token", async () => {
      const createdUser = await orchestrator.createUser();

      const usedToken = await activation.create(createdUser);

      await orchestrator.activateUser(createdUser);

      const response = await fetch(
        `http://localhost:3000/api/v1/activation/${usedToken.id}`,
        {
          method: "PATCH",
        },
      );

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "Você não pode mais usar tokens de ativação.",
        action: "Entre em contato com o suporte.",
        status_code: 403,
      });
    });

    test("With valid token", async () => {
      const createdUser = await orchestrator.createUser();

      const activationToken = await activation.create(createdUser);

      const response = await fetch(
        `http://localhost:3000/api/v1/activation/${activationToken.id}`,
        {
          method: "PATCH",
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(uuidVersion(responseBody.user_id)).toBe(4);

      expect(responseBody.user_id).toBe(createdUser.id);

      expect(Date.parse(responseBody.used_at)).not.toBeNaN();
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      expect(Date.parse(responseBody.expires_at)).not.toBeNaN();

      expect(responseBody.used_at === responseBody.updated_at).toBe(true);
      expect(responseBody.expires_at > responseBody.updated_at).toBe(true);

      const activatedUser = await user.findOneById(responseBody.user_id);

      expect(activatedUser.features).toEqual([
        "read:session",
        "create:session",
      ]);
    });

    test("With valid token but already activated user", async () => {
      const createdUser = await orchestrator.createUser();

      await orchestrator.activateUser(createdUser);

      const validToken = await activation.create(createdUser);

      const response = await fetch(
        `http://localhost:3000/api/v1/activation/${validToken.id}`,
        {
          method: "PATCH",
        },
      );

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "Você não pode mais usar tokens de ativação.",
        action: "Entre em contato com o suporte.",
        status_code: 403,
      });
    });
  });

  describe("Default user", () => {
    test("With valid token, but already logged in user", async () => {
      const user1 = await orchestrator.createUser();
      await orchestrator.activateUser(user1);
      const user1SessionObject = await orchestrator.createSession(user1);

      const user2 = await orchestrator.createUser();
      const user2ActivationToken = await activation.create(user2);

      const response = await fetch(
        `http://localhost:3000/api/v1/activation/${user2ActivationToken.id}`,
        {
          method: "PATCH",
          headers: {
            Cookie: `session_id=${user1SessionObject.token}`,
          },
        },
      );

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "O usuário não possui permissão para executar esta ação.",
        action:
          'Verifique se o usuário possui a feature "read:activation_token".',
        status_code: 403,
      });
    });
  });
});
