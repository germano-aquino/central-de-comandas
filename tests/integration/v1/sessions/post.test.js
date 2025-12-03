import orchestrator from "tests/orchestrator";

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

    test("With valid data", async () => {});
  });
});
