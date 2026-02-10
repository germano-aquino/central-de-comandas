import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/customers/[customer_name]", () => {
  describe("Default user", () => {
    test("With valid data", async () => {
      const loggedUser = await orchestrator.createLoggedUser();

      const response = await fetch(
        `http://localhost:3000/api/v1/customers/NotAllowedUser`,
        {
          headers: {
            Cookie: `session_id=${loggedUser.token}`,
          },
        },
      );

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "O usuário não possui permissão para executar esta ação.",
        action: 'Verifique se o usuário possui a feature "read:customer".',
        status_code: 403,
      });
    });
  });

  describe("Allowed user", () => {
    test("With valid data", async () => {
      const inactiveUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(inactiveUser);
      const userSession = await orchestrator.createSession(activatedUser);
      await orchestrator.addCustomerFeatures(activatedUser);

      let customers = await orchestrator.createCustomers(7);
      customers = customers.map((customer) => {
        return {
          ...customer,
          created_at: customer.created_at.toISOString(),
          updated_at: customer.updated_at.toISOString(),
        };
      });

      const response = await fetch(
        `http://localhost:3000/api/v1/customers/${customers[1].name}`,
        {
          headers: {
            Cookie: `session_id=${userSession.token}`,
          },
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual(customers[1]);
    });
  });

  describe("Anonymous user", () => {
    test("With valid data", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/customers/NotAllowedUser",
      );

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "O usuário não possui permissão para executar esta ação.",
        action: 'Verifique se o usuário possui a feature "read:customer".',
        status_code: 403,
      });
    });
  });
});
