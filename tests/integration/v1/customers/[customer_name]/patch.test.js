import customer from "@/models/customer";
import orchestrator from "tests/orchestrator";

import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("PATCH /api/v1/customers/[customer_name]", () => {
  describe("Default user", () => {
    test("With valid data and without permission", async () => {
      const loggedUser = await orchestrator.createLoggedUser();

      const editedCustomer = await orchestrator.createCustomer("OldName");

      const response = await fetch(
        `http://localhost:3000/api/v1/customers/${editedCustomer.name}`,
        {
          method: "PATCH",
          headers: {
            Cookie: `session_id=${loggedUser.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            name: "NewName",
          }),
        },
      );

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "O usuário não possui permissão para executar esta ação.",
        action: 'Verifique se o usuário possui a feature "edit:customer".',
        status_code: 403,
      });
    });
  });

  describe("Allowed user", () => {
    test("With new name", async () => {
      const loggedUser = await orchestrator.createLoggedUser();
      await orchestrator.addFeatures(loggedUser, customer.addFeatures);

      const editedCustomer = await orchestrator.createCustomer();

      const response = await fetch(
        `http://localhost:3000/api/v1/customers/${editedCustomer.name}`,
        {
          method: "PATCH",
          headers: {
            Cookie: `session_id=${loggedUser.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            name: "Update Name",
          }),
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody.name).toBe("Update Name");
      expect(responseBody.phone).toBe(editedCustomer.phone);
      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      expect(Date.parse(responseBody.created_at)).toBeLessThan(
        Date.parse(responseBody.updated_at),
      );
    });

    test("With new phone", async () => {
      const loggedUser = await orchestrator.createLoggedUser();
      await orchestrator.addFeatures(loggedUser, customer.addFeatures);

      const editedCustomer = await orchestrator.createCustomer();

      const response = await fetch(
        `http://localhost:3000/api/v1/customers/${editedCustomer.name}`,
        {
          method: "PATCH",
          headers: {
            Cookie: `session_id=${loggedUser.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            phone: "+5591989897878",
          }),
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody.phone).toBe("+5591989897878");
      expect(responseBody.name).toBe(editedCustomer.name);
      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      expect(Date.parse(responseBody.created_at)).toBeLessThan(
        Date.parse(responseBody.updated_at),
      );
    });

    test("With different case", async () => {
      const loggedUser = await orchestrator.createLoggedUser();
      await orchestrator.addFeatures(loggedUser, customer.addFeatures);

      const editedCustomer = await orchestrator.createCustomer("mismatchcase");

      const response = await fetch(
        `http://localhost:3000/api/v1/customers/${editedCustomer.name}`,
        {
          method: "PATCH",
          headers: {
            Cookie: `session_id=${loggedUser.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            name: "misMatchCase",
          }),
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: editedCustomer.id,
        name: "misMatchCase",
        phone: editedCustomer.phone,
        created_at: editedCustomer.created_at.toISOString(),
        updated_at: responseBody.updated_at,
      });

      expect(Date.parse(responseBody.created_at)).toBeLessThan(
        Date.parse(responseBody.updated_at),
      );
    });

    test("With nonexistent customer name", async () => {
      const loggedUser = await orchestrator.createLoggedUser();
      await orchestrator.addFeatures(loggedUser, customer.addFeatures);

      const response = await fetch(
        `http://localhost:3000/api/v1/customers/NonexistentStore`,
        {
          method: "PATCH",
          headers: {
            Cookie: `session_id=${loggedUser.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            name: "New Store Name",
          }),
        },
      );

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: `Não existe cliente com esse nome.`,
        action: "Verifique se o nome está correto e tente novamente.",
        status_code: 400,
      });
    });
  });

  describe("Anonymous user", () => {
    test("With valid data", async () => {
      const customer = await orchestrator.createCustomer();

      const response = await fetch(
        `http://localhost:3000/api/v1/customers/${customer.name}`,
        {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            name: "othername",
          }),
        },
      );

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "O usuário não possui permissão para executar esta ação.",
        action: 'Verifique se o usuário possui a feature "edit:customer".',
        status_code: 403,
      });
    });
  });
});
