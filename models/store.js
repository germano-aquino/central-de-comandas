import database from "@/infra/database";
import user from "./user";
import { NotFoundError, ValidationError } from "@/infra/errors";

import { version as uuidVersion } from "uuid";
import mold from "./mold";

async function create(storeInputValues) {
  await validateUniqueName(storeInputValues.name);
  const storeName = storeInputValues.name;
  const moldId = storeInputValues?.mold_id ? storeInputValues.mold_id : null;

  const storeCreated = await runInsertQuery(storeName, moldId);
  return storeCreated;

  async function runInsertQuery(storeName, moldId) {
    const results = await database.query({
      text: `
        INSERT INTO
          stores
          (name, mold_id)
        VALUES
          ($1, $2)
        RETURNING
          *
      ;`,
      values: [storeName, moldId],
    });

    return results.rows[0];
  }
}

async function validateUniqueName(storeName) {
  const results = await database.query({
    text: `
        SELECT
          *
        FROM
          stores
        WHERE
          LOWER(name) = LOWER($1)
        LIMIT
          1
      ;`,
    values: [storeName],
  });

  if (results.rowCount > 0) {
    throw new ValidationError({
      message: "Este nome de loja já está sendo utilizado.",
      action: "Escolha um novo nome para loja e tente novamente.",
    });
  }
}

async function update(storeInputValues, storeName) {
  await validateUpdateInputValues(storeInputValues, storeName);

  const updatedStore = await runUpdateQuery(storeInputValues, storeName);

  return updatedStore;

  async function validateUpdateInputValues(inputValues, storeName) {
    try {
      if ("name" in inputValues) {
        const newName = inputValues.name;
        if (newName.toLowerCase() !== storeName.toLowerCase()) {
          await validateUniqueName(newName);
        }
      }

      if ("mold_id" in inputValues) {
        if (uuidVersion(inputValues.mold_id) !== 4) {
          throw new ValidationError({
            message:
              "A propriedade mold_id está inválida. Não é um uuid versão 4.",
            action: "Modifique o mold_id para um id válido.",
          });
        }

        await mold.findOneValidById(inputValues.mold_id);
      } else inputValues.mold_id = null;

      await findOneValidByName(storeName);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new ValidationError(error);
      } else throw error;
    }
  }

  async function runUpdateQuery(storeInputValues, oldName) {
    const results = await database.query({
      text: `
        UPDATE
          stores
        SET
          name = COALESCE($2, name),
          mold_id = COALESCE($3, mold_id),
          updated_at = TIMEZONE('utc', NOW())
        WHERE
          name = $1
        RETURNING
          *
      ;`,
      values: [oldName, storeInputValues.name, storeInputValues.mold_id],
    });

    return results.rows[0];
  }
}

async function deleteManyByIdArray(storeIds) {
  const deletedStores = await runDeleteQuery(storeIds);

  return deletedStores;

  async function runDeleteQuery(storeIds) {
    const results = await database.query({
      text: `
        DELETE FROM
          stores
        WHERE
          id = ANY($1)
        RETURNING
          *
      ;`,
      values: [storeIds],
    });

    return results.rows;
  }
}

async function deleteOneByName(storeName) {
  const storeToBeDeleted = await findOneValidByName(storeName);

  const storeDeleted = await runDeleteQuery(storeToBeDeleted.id);
  return storeDeleted;

  async function runDeleteQuery(id) {
    const results = await database.query({
      text: `
        DELETE FROM
          stores
        WHERE
          id = $1
        RETURNING
          *
      ;`,
      values: [id],
    });

    return results.rows[0];
  }
}

async function findOneValidByName(storeName) {
  const validStore = await runSelectQuery(storeName.trim());

  return validStore;

  async function runSelectQuery(storeName) {
    const results = await database.query({
      text: `
        SELECT
          *
        FROM
          stores
        WHERE
          LOWER(name) = LOWER($1)
        LIMIT
          1
      ;`,
      values: [storeName],
    });

    if (results.rowCount != 1) {
      throw new NotFoundError({
        message: "Não existe uma loja com esse nome.",
        action: "Confirme o nome da loja e tente novamente.",
      });
    }

    return results.rows[0];
  }
}

async function findOneValidById(storeId) {
  const validStore = await runSelectQuery(storeId);

  return validStore;

  async function runSelectQuery(storeId) {
    const results = await database.query({
      text: `
        SELECT
          *
        FROM
          stores
        WHERE
          id = $1
        LIMIT
          1
      ;`,
      values: [storeId],
    });

    if (results.rowCount != 1) {
      throw new NotFoundError({
        message: "Não existe uma loja com esse id.",
        action: "Confirme o id da loja e tente novamente.",
      });
    }

    return results.rows[0];
  }
}

async function retrieveAll() {
  const stores = await runSelectQuery();

  return stores;

  async function runSelectQuery() {
    const results = await database.query(
      `
        SELECT
          *
        FROM
          stores
      ;`,
    );

    return results.rows;
  }
}

async function addFeatures(unallowedUser) {
  const allowedUser = await user.addFeaturesByUserId(unallowedUser.id, [
    "create:store",
    "read:store",
    "edit:store",
    "delete:store",
  ]);
  return allowedUser;
}

const store = {
  create,
  update,
  deleteOneByName,
  deleteManyByIdArray,
  retrieveAll,
  findOneValidByName,
  findOneValidById,
  addFeatures,
};

export default store;
