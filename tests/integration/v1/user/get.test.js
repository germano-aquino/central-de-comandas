import session from "models/session";
import orchestrator from "tests/orchestrator";

import setCookieParser from "set-cookie-parser";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET to /api/v1/user", () => {
  describe("Default user", () => {
    test("With nonexistent token", async () => {
      const nonexistentToken =
        "05f96d6d8238a1195d07c489624e2fc65dc1132007ba41c30b58698f4fe1f957";

      const response = await fetch("http://localhost:3000/api/v1/user", {
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

      const parsedCookies = setCookieParser(response, { map: true });

      expect(parsedCookies.session_id).toEqual({
        name: "session_id",
        value: "invalid",
        path: "/",
        maxAge: -1,
        httpOnly: true,
      });
    });

    test("With expired token", async () => {
      jest.useFakeTimers({
        now: new Date(Date.now() - session.EXPIRATION_IN_MILLISECONDS),
      });

      const createdUser = await orchestrator.createUser({
        username: "expiredUser",
      });

      const expiredSession = await orchestrator.createSession(createdUser);

      jest.useRealTimers();

      const response = await fetch("http://localhost:3000/api/v1/user", {
        headers: {
          Cookie: `session_id=${expiredSession.token}`,
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

      const parsedCookies = setCookieParser(response, { map: true });

      expect(parsedCookies.session_id).toEqual({
        name: "session_id",
        value: "invalid",
        path: "/",
        maxAge: -1,
        httpOnly: true,
      });
    });

    test("With halfway expired token", async () => {
      jest.useFakeTimers({
        now: new Date(Date.now() - session.EXPIRATION_IN_MILLISECONDS / 2),
      });

      const createdUser = await orchestrator.createUser({
        username: "halfwayExpiredUser",
      });

      const halfwayExpiredSession =
        await orchestrator.createSession(createdUser);

      jest.useRealTimers();

      const response = await fetch("http://localhost:3000/api/v1/user", {
        headers: {
          Cookie: `session_id=${halfwayExpiredSession.token}`,
        },
      });

      expect(response.status).toBe(200);

      //Ensures to not use cached Response
      const cacheControlHeader = response.headers.get("Cache-Control");

      expect(cacheControlHeader).toBe(
        "no-store, no-cache, max-age=0, must-revalidate",
      );

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: createdUser.id,
        username: createdUser.username,
        email: createdUser.email,
        features: ["read:activation_token"],
        password: createdUser.password,
        created_at: createdUser.created_at.toISOString(),
        updated_at: createdUser.updated_at.toISOString(),
      });

      //renewedSession assertions
      const renewedSession = await session.findOneValidByToken(
        halfwayExpiredSession.token,
      );

      expect(renewedSession.expires_at > halfwayExpiredSession.expires_at).toBe(
        true,
      );
      expect(renewedSession.updated_at > renewedSession.created_at).toBe(true);

      expect(
        renewedSession.expires_at -
          halfwayExpiredSession.expires_at -
          session.EXPIRATION_IN_MILLISECONDS / 2,
      ).toBeLessThanOrEqual(200);
      expect(
        renewedSession.updated_at -
          halfwayExpiredSession.updated_at -
          session.EXPIRATION_IN_MILLISECONDS / 2,
      ).toBeLessThanOrEqual(200);

      //set-Cookie assertions
      const parsedCookies = setCookieParser(response, { map: true });

      expect(parsedCookies.session_id).toEqual({
        name: "session_id",
        value: halfwayExpiredSession.token,
        maxAge: session.EXPIRATION_IN_MILLISECONDS / 1000,
        path: "/",
        httpOnly: true,
      });
    });

    test("With valid session", async () => {
      const unloggedUser = await orchestrator.createUser();

      const sessionObject = await orchestrator.createSession(unloggedUser);

      const response = await fetch("http://localhost:3000/api/v1/user", {
        headers: {
          Cookie: `session_id=${sessionObject.token}`,
        },
      });

      expect(response.status).toBe(200);

      //Ensures to not use cached Response
      const cacheControlHeader = response.headers.get("Cache-Control");

      expect(cacheControlHeader).toBe(
        "no-store, no-cache, max-age=0, must-revalidate",
      );

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: unloggedUser.id,
        username: unloggedUser.username,
        email: unloggedUser.email,
        features: ["read:activation_token"],
        password: unloggedUser.password,
        created_at: unloggedUser.created_at.toISOString(),
        updated_at: unloggedUser.updated_at.toISOString(),
      });

      //renewedSession assertions
      const renewedSession = await session.findOneValidByToken(
        sessionObject.token,
      );

      expect(renewedSession.expires_at > sessionObject.expires_at).toBe(true);
      expect(renewedSession.updated_at > renewedSession.created_at).toBe(true);

      //set-Cookie assertions
      const parsedCookies = setCookieParser(response, { map: true });

      expect(parsedCookies.session_id).toEqual({
        name: "session_id",
        value: sessionObject.token,
        maxAge: session.EXPIRATION_IN_MILLISECONDS / 1000,
        path: "/",
        httpOnly: true,
      });
    });
  });
});
