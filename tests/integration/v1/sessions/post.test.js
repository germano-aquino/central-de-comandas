import session from "models/session";
import orchestrator from "tests/orchestrator";
import { version as uuidVersion } from "uuid";
import setCookieParser from "set-cookie-parser";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/sessions", () => {
  describe("Anonymous user", () => {
    test("With incorrect email and correct password", async () => {
      await orchestrator.createUser({
        email: "correct.email@example.com",
        password: "correctPassword",
      });

      const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email: "wrong.email@example.com",
          password: "correctPassword",
        }),
      });

      expect(response.status).toBe(401);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "O email ou a senha estão incorretos.",
        action: "Verifique os dados de login e tente novamente.",
        status_code: 401,
      });
    });

    test("With correct email and incorrect password", async () => {
      const createdUser = await orchestrator.createUser({
        password: "correctPassword",
      });

      const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email: createdUser.email,
          password: "wrongPassword",
        }),
      });

      expect(response.status).toBe(401);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "O email ou a senha estão incorretos.",
        action: "Verifique os dados de login e tente novamente.",
        status_code: 401,
      });
    });

    test("With valid data", async () => {
      const userToLogin = await orchestrator.createUser({
        password: "validPassword",
      });

      await orchestrator.activateUser(userToLogin);

      const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email: userToLogin.email,
          password: "validPassword",
        }),
      });

      expect(response.status).toBe(201);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        user_id: userToLogin.id,
        token: responseBody.token,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
        expires_at: responseBody.expires_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(responseBody.user_id).toBe(userToLogin.id);

      const expiresAt = Date.parse(responseBody.expires_at);
      const createdAt = Date.parse(responseBody.created_at);

      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      expect(createdAt).not.toBeNaN();
      expect(expiresAt).not.toBeNaN();

      const expirationTime = expiresAt - createdAt;
      expect(expirationTime - session.EXPIRATION_IN_MILLISECONDS).toBeLessThan(
        200,
      );

      const parsedSetCookie = setCookieParser(response, { map: true });

      expect(parsedSetCookie.session_id).toEqual({
        name: "session_id",
        value: responseBody.token,
        maxAge: session.EXPIRATION_IN_MILLISECONDS / 1000,
        path: "/",
        httpOnly: true,
      });
    });

    test("Create 2 sessions with the same user", async () => {
      const userToLogin = await orchestrator.createUser({
        password: "validPassword",
      });

      await orchestrator.activateUser(userToLogin);

      const firstResponse = await fetch(
        "http://localhost:3000/api/v1/sessions",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            email: userToLogin.email,
            password: "validPassword",
          }),
        },
      );

      expect(firstResponse.status).toBe(201);

      const secondResponse = await fetch(
        "http://localhost:3000/api/v1/sessions",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            email: userToLogin.email,
            password: "validPassword",
          }),
        },
      );

      const responseBody = await secondResponse.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        user_id: userToLogin.id,
        token: responseBody.token,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
        expires_at: responseBody.expires_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(responseBody.user_id).toBe(userToLogin.id);

      const expiresAt = Date.parse(responseBody.expires_at);
      const createdAt = Date.parse(responseBody.created_at);

      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      expect(createdAt).not.toBeNaN();
      expect(expiresAt).not.toBeNaN();

      const expirationTime = expiresAt - createdAt;
      expect(expirationTime - session.EXPIRATION_IN_MILLISECONDS).toBeLessThan(
        200,
      );

      const parsedSetCookie = setCookieParser(secondResponse, { map: true });

      expect(parsedSetCookie.session_id).toEqual({
        name: "session_id",
        value: responseBody.token,
        maxAge: session.EXPIRATION_IN_MILLISECONDS / 1000,
        path: "/",
        httpOnly: true,
      });
    });
  });
});
