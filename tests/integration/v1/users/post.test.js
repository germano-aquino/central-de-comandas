import orchestrator from "tests/orchestrator";

import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/users", () => {
  describe("Anonymous User", () => {
    test("With valid informations", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          username: "correctUser",
          email: "correct.user@example.com",
          password: "correctPassword",
        }),
      });

      expect(response.status).toBe(201);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "correctUser",
        email: "correct.user@example.com",
        password: "correctPassword",
        updated_at: responseBody.updated_at,
        created_at: responseBody.created_at,
      });
      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
    });
  });
});
