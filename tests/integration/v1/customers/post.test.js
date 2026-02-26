import customer from "@/models/customer";
import orchestrator from "tests/orchestrator";

import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/customers", () => {
  describe("Default user", () => {
    test("With valid data and without permission", async () => {
      const loggedUser = await orchestrator.createLoggedUser();

      const response = await fetch("http://localhost:3000/api/v1/customers", {
        method: "POST",
        headers: {
          Cookie: `session_id=${loggedUser.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name: "NewCategory",
        }),
      });

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "O usuário não possui permissão para executar esta ação.",
        action: 'Verifique se o usuário possui a feature "create:customer".',
        status_code: 403,
      });
    });
  });

  describe("Allowed user", () => {
    test("With valid data", async () => {
      const loggedUser = await orchestrator.createLoggedUser();

      await orchestrator.addFeatures(loggedUser, customer.addFeatures);

      const response = await fetch("http://localhost:3000/api/v1/customers", {
        method: "POST",
        headers: {
          Cookie: `session_id=${loggedUser.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name: "Debora D",
          phone: "+55 91 98765-4321",
        }),
      });

      expect(response.status).toBe(201);

      const responseBody = await response.json();

      expect(responseBody.name).toBe("Debora D");
      expect(responseBody.phone).toBe("+5591987654321");
      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });

    test("With duplicated customer name", async () => {
      const loggedUser = await orchestrator.createLoggedUser();

      await orchestrator.addFeatures(loggedUser, customer.addFeatures);

      const response = await fetch("http://localhost:3000/api/v1/customers", {
        method: "POST",
        headers: {
          Cookie: `session_id=${loggedUser.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name: "debora d",
          phone: "+55 9131654987",
        }),
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "O nome escolhido para o cliente já está sendo utilizado.",
        action: "Escolha um novo nome para o cliente e tente novamente.",
        status_code: 400,
      });
    });

    test("With duplicated customer phone", async () => {
      const loggedUser = await orchestrator.createLoggedUser();

      await orchestrator.addFeatures(loggedUser, customer.addFeatures);

      const response = await fetch("http://localhost:3000/api/v1/customers", {
        method: "POST",
        headers: {
          Cookie: `session_id=${loggedUser.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name: "maria l",
          phone: "+55 91 987654321",
        }),
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message:
          "O número de telefone escolhido para o cliente já está sendo utilizado.",
        action:
          "Escolha um novo número de telefone para o cliente e tente novamente.",
        status_code: 400,
      });
    });

    test("With missing customer name", async () => {
      const loggedUser = await orchestrator.createLoggedUser();

      await orchestrator.addFeatures(loggedUser, customer.addFeatures);

      const response = await fetch("http://localhost:3000/api/v1/customers", {
        method: "POST",
        headers: {
          Cookie: `session_id=${loggedUser.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          phone: "+55 91 986754321",
        }),
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message:
          "Não é possível criar novo cliente. Campo nome do cliente está inválido.",
        action: "Inclua um valor não vazio para o campo nome do cliente.",
        status_code: 400,
      });
    });

    test("With missing customer phone", async () => {
      const loggedUser = await orchestrator.createLoggedUser();

      await orchestrator.addFeatures(loggedUser, customer.addFeatures);

      const response = await fetch("http://localhost:3000/api/v1/customers", {
        method: "POST",
        headers: {
          Cookie: `session_id=${loggedUser.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name: "larissa manuela",
        }),
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message:
          "Não é possível criar novo cliente. Campo número de telefone do cliente está inválido.",
        action:
          "Inclua um valor com o seguinte formato '+55 91 987654231' para o campo número de telefone do cliente.",
        status_code: 400,
      });
    });
  });

  describe("Anonymous user", () => {
    test("With valid data", async () => {
      const response = await fetch("http://localhost:3000/api/v1/customers", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name: "juliana a",
          phone: "+55 91 564897231",
        }),
      });

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "O usuário não possui permissão para executar esta ação.",
        action: 'Verifique se o usuário possui a feature "create:customer".',
        status_code: 403,
      });
    });
  });
});
