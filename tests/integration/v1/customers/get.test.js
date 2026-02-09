import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/customers", () => {
  describe("Default user", () => {
    test("Without permission", async () => {
      const loggedUser = await orchestrator.createLoggedUser();

      const response = await fetch("http://localhost:3000/api/v1/customers", {
        headers: {
          Cookie: `session_id=${loggedUser.token}`,
        },
      });

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
    test("With a valid request", async () => {
      const loggedUser = await orchestrator.createLoggedUser();
      await orchestrator.addCustomerFeatures(loggedUser);

      let customers = await orchestrator.createCustomers(7);
      customers = customers.map((customer) => {
        return {
          ...customer,
          created_at: customer.created_at.toISOString(),
          updated_at: customer.updated_at.toISOString(),
        };
      });

      const response = await fetch("http://localhost:3000/api/v1/customers", {
        headers: {
          Cookie: `session_id=${loggedUser.token}`,
        },
      });

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual(customers);
    });

    test("With name filter", async () => {
      const loggedUser = await orchestrator.createLoggedUser();
      await orchestrator.addCustomerFeatures(loggedUser);

      await orchestrator.createCustomers(7);

      let expectedCustomer = await orchestrator.createCustomer("Debora Alice");
      expectedCustomer = {
        ...expectedCustomer,
        created_at: expectedCustomer.created_at.toISOString(),
        updated_at: expectedCustomer.updated_at.toISOString(),
      };

      const params = new URLSearchParams();
      params.append("name", "ebora");

      const response = await fetch(
        `http://localhost:3000/api/v1/customers?${params}`,
        {
          headers: {
            Cookie: `session_id=${loggedUser.token}`,
          },
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual([expectedCustomer]);
    });

    test("With phone filter", async () => {
      const loggedUser = await orchestrator.createLoggedUser();
      await orchestrator.addCustomerFeatures(loggedUser);

      await orchestrator.createCustomers(7);

      let expectedCustomer = await orchestrator.createCustomer();
      expectedCustomer = {
        ...expectedCustomer,
        created_at: expectedCustomer.created_at.toISOString(),
        updated_at: expectedCustomer.updated_at.toISOString(),
      };

      const params = new URLSearchParams();
      params.append("phone", expectedCustomer.phone);

      const response = await fetch(
        `http://localhost:3000/api/v1/customers?${params}`,
        {
          headers: {
            Cookie: `session_id=${loggedUser.token}`,
          },
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual([expectedCustomer]);
    });
  });

  describe("Anonymous user", () => {
    test("With valid data", async () => {
      const response = await fetch("http://localhost:3000/api/v1/customers");

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
