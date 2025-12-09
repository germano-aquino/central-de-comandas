import webserver from "infra/webserver";
import activation from "models/activation";
import session from "models/session";
import user from "models/user";
import orchestrator from "tests/orchestrator";

import { version as uuidVersion } from "uuid";
import setCookieParser from "set-cookie-parser";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
  await orchestrator.deleteAllEmails();
});

describe("Registration Flow (all successfull)", () => {
  let createdUser;
  let activationToken;
  let sessionToken;

  test("Create user", async () => {
    const response = await fetch("http://localhost:3000/api/v1/users", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        username: "RegistrationFlow",
        email: "registration.flow@example.com",
        password: "registrationflow",
      }),
    });

    expect(response.status).toBe(201);

    createdUser = await response.json();

    expect(createdUser).toEqual({
      id: createdUser.id,
      username: "RegistrationFlow",
      email: "registration.flow@example.com",
      features: ["read:activation_token"],
      password: createdUser.password,
      updated_at: createdUser.updated_at,
      created_at: createdUser.created_at,
    });
  });

  test("Receive activation email", async () => {
    activationToken = await activation.findOneValidByUserId(createdUser.id);

    const lastEmail = await orchestrator.getLastEmail();

    expect(lastEmail.sender).toBe("<contato@curso.dev>");
    expect(lastEmail.recipients[0]).toBe("<registration.flow@example.com>");
    expect(lastEmail.subject).toBe(
      "Email de Ativação de Cadastro na Central de Comandas",
    );
    expect(lastEmail.text).toContain(`link de ativação`);
    expect(lastEmail.text).toContain(
      `${webserver.origin}/cadastro/ativar/${activationToken.id}`,
    );
  });

  test("Activate account", async () => {
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

    const usedAt = Date.parse(responseBody.used_at);
    const expiresAt = Date.parse(responseBody.expires_at);
    const createdAt = Date.parse(responseBody.created_at);
    const updatedAt = Date.parse(responseBody.updated_at);

    expect(usedAt).not.toBeNaN();
    expect(expiresAt).not.toBeNaN();
    expect(createdAt).not.toBeNaN();
    expect(updatedAt).not.toBeNaN();

    expect(expiresAt > usedAt).toBe(true);
    expect(updatedAt > createdAt).toBe(true);

    //Verify if user is active
    const activatedUser = await user.findOneByUsername("RegistrationFlow");

    expect(activatedUser.features).toEqual(["read:session", "create:session"]);
  });

  test("Login", async () => {
    const response = await fetch("http://localhost:3000/api/v1/sessions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: createdUser.email,
        password: "registrationflow",
      }),
    });

    expect(response.status).toBe(201);

    const responseBody = await response.json();
    const parsedSetCookie = setCookieParser(response, { map: true });
    sessionToken = responseBody.token;

    expect(parsedSetCookie.session_id).toEqual({
      name: "session_id",
      value: responseBody.token,
      maxAge: session.EXPIRATION_IN_MILLISECONDS / 1000,
      path: "/",
      httpOnly: true,
    });
  });

  test("Get user informations", async () => {
    const response = await fetch("http://localhost:3000/api/v1/user", {
      headers: {
        Cookie: `session_id=${sessionToken}`,
      },
    });

    expect(response.status).toBe(200);

    const responseBody = await response.json();

    expect(responseBody).toEqual({
      id: createdUser.id,
      username: createdUser.username,
      email: createdUser.email,
      password: createdUser.password,
      created_at: createdUser.created_at,
      updated_at: responseBody.updated_at,
      features: ["read:session", "create:session"],
    });
  });
});
