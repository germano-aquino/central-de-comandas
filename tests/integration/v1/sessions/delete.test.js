import session from "models/session";
import orchestrator from "tests/orchestrator";
import { version as uuidVersion } from "uuid";
import setCookieParser from "set-cookie-parser";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("DELETE /api/v1/sessions", () => {
  describe("Anonymous user", () => {
    test("With nonexistent token", async () => {
      const nonexistentToken =
        "f71b3f417132aa6374640d90688b593a690a68a2cca9344170ac57c69fa9e62a";

      const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "DELETE",
        headers: {
          Cookie: `session_id=${nonexistentToken}`,
        },
      });

      expect(response.status).toBe(401);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Usuário não possui sessão ativa.",
        action: "Verifique se o usuário está logado e tente novamente.",
        status_code: 401,
      });
    });
  });

  describe("Default user", () => {
    test("With valid token", async () => {
      const userToLogOut = await orchestrator.createUser({
        password: "validPassword",
      });

      const createdSession = await orchestrator.createSession(userToLogOut);

      const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "DELETE",
        headers: {
          Cookie: `session_id=${createdSession.token}`,
        },
      });

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        user_id: userToLogOut.id,
        token: createdSession.token,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
        expires_at: responseBody.expires_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(responseBody.user_id).toBe(userToLogOut.id);

      const expiresAt = Date.parse(responseBody.expires_at);
      const createdAt = Date.parse(responseBody.created_at);
      const updatedAt = Date.parse(responseBody.updated_at);

      expect(updatedAt).not.toBeNaN();
      expect(createdAt).not.toBeNaN();
      expect(expiresAt).not.toBeNaN();

      expect(updatedAt > createdAt).toBe(true);
      expect(expiresAt).toBeLessThan(Date.now());

      const parsedSetCookie = setCookieParser(response, { map: true });

      expect(parsedSetCookie.session_id).toEqual({
        name: "session_id",
        value: "invalid",
        maxAge: -1,
        path: "/",
        httpOnly: true,
      });
    });

    test("With halfway expired token", async () => {
      jest.useFakeTimers({
        now: new Date(Date.now() - session.EXPIRATION_IN_MILLISECONDS / 2),
      });

      const userToLogOut = await orchestrator.createUser({
        password: "validPassword",
      });

      const createdSession = await orchestrator.createSession(userToLogOut);

      jest.useRealTimers();

      const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "DELETE",
        headers: {
          Cookie: `session_id=${createdSession.token}`,
        },
      });

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        user_id: userToLogOut.id,
        token: createdSession.token,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
        expires_at: responseBody.expires_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(responseBody.user_id).toBe(userToLogOut.id);

      const expiresAt = Date.parse(responseBody.expires_at);
      const createdAt = Date.parse(responseBody.created_at);
      const updatedAt = Date.parse(responseBody.updated_at);

      expect(updatedAt).not.toBeNaN();
      expect(createdAt).not.toBeNaN();
      expect(expiresAt).not.toBeNaN();

      expect(updatedAt > createdAt).toBe(true);
      expect(expiresAt).toBeLessThan(Date.now());

      const parsedSetCookie = setCookieParser(response, { map: true });

      expect(parsedSetCookie.session_id).toEqual({
        name: "session_id",
        value: "invalid",
        maxAge: -1,
        path: "/",
        httpOnly: true,
      });
    });

    test("With expired token", async () => {
      jest.useFakeTimers({
        now: new Date(Date.now() - session.EXPIRATION_IN_MILLISECONDS),
      });

      const userToLogOut = await orchestrator.createUser({
        password: "validPassword",
      });

      const createdSession = await orchestrator.createSession(userToLogOut);

      jest.useRealTimers();

      const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "DELETE",
        headers: {
          Cookie: `session_id=${createdSession.token}`,
        },
      });

      expect(response.status).toBe(401);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Usuário não possui sessão ativa.",
        action: "Verifique se o usuário está logado e tente novamente.",
        status_code: 401,
      });
    });
  });
});
