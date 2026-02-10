import { NotFoundError } from "infra/errors";
import customer from "models/customer";
import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("DELETE /api/v1/customers/[customer_name]", () => {
  describe("Default user", () => {
    test("With valid data and without permission", async () => {
      const loggedUser = await orchestrator.createLoggedUser();

      const customer = await orchestrator.createCustomer("OldName");

      const response = await fetch(
        `http://localhost:3000/api/v1/customers/${customer.name}`,
        {
          method: "DELETE",
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
        action: 'Verifique se o usuário possui a feature "delete:customer".',
        status_code: 403,
      });
    });
  });

  describe("Allowed user", () => {
    test("With valid data", async () => {
      const loggedUser = await orchestrator.createLoggedUser();
      await orchestrator.addCustomerFeatures(loggedUser);

      const customerToBeDeleted = await orchestrator.createCustomer();

      const response = await fetch(
        `http://localhost:3000/api/v1/customers/${customerToBeDeleted.name}`,
        {
          method: "DELETE",
          headers: {
            Cookie: `session_id=${loggedUser.token}`,
          },
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: customerToBeDeleted.id,
        name: customerToBeDeleted.name,
        phone: customerToBeDeleted.phone,
        created_at: customerToBeDeleted.created_at.toISOString(),
        updated_at: customerToBeDeleted.updated_at.toISOString(),
      });

      //Verify that customer doesn't exist on database

      await expect(
        customer.findOneValidByName(customerToBeDeleted.name),
      ).rejects.toThrow(NotFoundError);
    });

    test("With different case", async () => {
      const loggedUser = await orchestrator.createLoggedUser();
      await orchestrator.addCustomerFeatures(loggedUser);

      const customerToBeDeleted =
        await orchestrator.createCustomer("mismatchcase");

      const response = await fetch(
        `http://localhost:3000/api/v1/customers/MismatchCase`,
        {
          method: "DELETE",
          headers: {
            Cookie: `session_id=${loggedUser.token}`,
          },
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: customerToBeDeleted.id,
        name: customerToBeDeleted.name,
        phone: customerToBeDeleted.phone,
        created_at: customerToBeDeleted.created_at.toISOString(),
        updated_at: customerToBeDeleted.updated_at.toISOString(),
      });

      //Verify that customer doesn't exist on database

      await expect(
        customer.findOneValidByName(customerToBeDeleted.name),
      ).rejects.toThrow(NotFoundError);
    });

    test("With nonexistent customer name", async () => {
      const loggedUser = await orchestrator.createLoggedUser();
      await orchestrator.addCustomerFeatures(loggedUser);

      const response = await fetch(
        `http://localhost:3000/api/v1/customers/NonexistentCategory`,
        {
          method: "DELETE",
          headers: {
            Cookie: `session_id=${loggedUser.token}`,
          },
        },
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "Não existe cliente com esse nome.",
        action: "Verifique se o nome está correto e tente novamente.",
        status_code: 404,
      });
    });
  });

  describe("Anonymous user", () => {
    test("With valid data", async () => {
      const customer = await orchestrator.createSection();

      const response = await fetch(
        `http://localhost:3000/api/v1/customers/${customer.name}`,
        {
          method: "DELETE",
        },
      );

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
