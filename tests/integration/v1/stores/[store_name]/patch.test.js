import store from "@/models/store";
import orchestrator from "tests/orchestrator";

import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("PATCH /api/v1/stores/[store_name]", () => {
  describe("Default user", () => {
    test("With valid data and without permission", async () => {
      const loggedUser = await orchestrator.createLoggedUser();

      const editedStore = await orchestrator.createStore("OldName");

      const response = await fetch(
        `http://localhost:3000/api/v1/stores/${editedStore.name}`,
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
        action: 'Verifique se o usuário possui a feature "edit:store".',
        status_code: 403,
      });
    });

    test("With permission and valid data", async () => {
      const loggedUser = await orchestrator.createLoggedUser();
      await orchestrator.addFeatures(loggedUser, store.addFeatures);

      const editedStore = await orchestrator.createStore();

      const response = await fetch(
        `http://localhost:3000/api/v1/stores/${editedStore.name}`,
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
      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      expect(Date.parse(responseBody.created_at)).toBeLessThan(
        Date.parse(responseBody.updated_at),
      );
    });

    test("With permission and with different case", async () => {
      const loggedUser = await orchestrator.createLoggedUser();
      await orchestrator.addFeatures(loggedUser, store.addFeatures);

      const editedStore = await orchestrator.createStore("mismatchcase");

      const response = await fetch(
        `http://localhost:3000/api/v1/stores/${editedStore.name}`,
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
        id: editedStore.id,
        name: "misMatchCase",
        mold_id: null,
        created_at: editedStore.created_at.toISOString(),
        updated_at: responseBody.updated_at,
      });

      expect(Date.parse(responseBody.created_at)).toBeLessThan(
        Date.parse(responseBody.updated_at),
      );
    });

    test("With permission and nonexistent store name", async () => {
      const loggedUser = await orchestrator.createLoggedUser();
      await orchestrator.addFeatures(loggedUser, store.addFeatures);

      const response = await fetch(
        `http://localhost:3000/api/v1/stores/NonexistentStore`,
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
        message: "Não existe uma loja com esse nome.",
        action: "Confirme o nome da loja e tente novamente.",
        status_code: 400,
      });
    });
  });

  describe("Anonymous user", () => {
    test("With valid data", async () => {
      const store = await orchestrator.createStore();

      const response = await fetch(
        `http://localhost:3000/api/v1/stores/${store.name}`,
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
        action: 'Verifique se o usuário possui a feature "edit:store".',
        status_code: 403,
      });
    });
  });
});
