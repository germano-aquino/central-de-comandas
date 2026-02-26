import { NotFoundError } from "infra/errors";
import customer from "models/customer";
import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("DELETE /api/v1/customers", () => {
  describe("Default user", () => {
    test("Without permission", async () => {
      const loggedUser = await orchestrator.createLoggedUser();

      let customers = await orchestrator.createCustomers(7);
      const customerIds = customers.map((customer) => customer.id);

      const response = await fetch("http://localhost:3000/api/v1/customers", {
        method: "DELETE",
        headers: {
          Cookie: `session_id=${loggedUser.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          customer_ids: customerIds,
        }),
      });

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "O usuário não possui permissão para executar esta ação.",
        action: 'Verifique se o usuário possui a feature "delete:customer".',
        status_code: 403,
      });
    });
  });

  describe("Allowed user", () => {
    test("With valid data", async () => {
      const loggedUser = await orchestrator.createLoggedUser();
      await orchestrator.addFeatures(loggedUser, customer.addFeatures);

      let customers = await orchestrator.createCustomers(7);
      customers = customers.map((customer) => {
        return {
          ...customer,
          created_at: customer.created_at.toISOString(),
          updated_at: customer.updated_at.toISOString(),
        };
      });
      const customerIds = customers.map((customer) => customer.id);

      const response = await fetch("http://localhost:3000/api/v1/customers", {
        method: "DELETE",
        headers: {
          Cookie: `session_id=${loggedUser.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          customer_ids: customerIds,
        }),
      });

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual(customers);

      //Verify that customer doesn't exist on database

      customers.map(async (deletedStore) => {
        await expect(
          customer.findOneValidByName(deletedStore.name),
        ).rejects.toThrow(NotFoundError);
      });
    });

    test("With nonexistent customer ids", async () => {
      const loggedUser = await orchestrator.createLoggedUser();
      await orchestrator.addFeatures(loggedUser, customer.addFeatures);

      const response = await fetch(`http://localhost:3000/api/v1/customers`, {
        method: "DELETE",
        headers: {
          Cookie: `session_id=${loggedUser.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          customer_ids: [
            "cbd746a2-6090-4e1d-9f92-873fca25514d",
            "d110e555-ebf2-4acc-ad72-63739372f537",
            "8882cc13-74c3-4170-9420-04077d68c7df",
            "1e806612-ddac-4241-8ae7-cdbabd306b3c",
          ],
        }),
      });

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual([]);
    });
  });

  describe("Anonymous user", () => {
    test("With valid data", async () => {
      const customers = await orchestrator.createSections(7);
      const customerIds = customers.map((customer) => customer.id);

      const response = await fetch("http://localhost:3000/api/v1/customers", {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          customer_ids: customerIds,
        }),
      });

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "O usuário não possui permissão para executar esta ação.",
        action: 'Verifique se o usuário possui a feature "delete:customer".',
        status_code: 403,
      });
    });
  });
});
