import database from "@/infra/database";
import user from "./user";
import { NotFoundError, ValidationError } from "@/infra/errors";

async function create(storeInputValues) {
  await validateUniqueName(storeInputValues.name);

  const storeCreated = await runInsertQuery(storeInputValues.name);
  return storeCreated;

  async function runInsertQuery(storeName) {
    const results = await database.query({
      text: `
        INSERT INTO
          stores
          (name)
        VALUES
          ($1)
        RETURNING
          *
      ;`,
      values: [storeName],
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

      await findOneValidByName(storeName);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new ValidationError({
          message: `Não é possível editar ${storeName}. Loja inexistente.`,
          action:
            "Verifique o nome da loja que deseja editar e tente novamente.",
        });
      } else throw error;
    }
  }

  async function runUpdateQuery(storeInputValues, oldName) {
    const results = await database.query({
      text: `
        UPDATE
          stores
        SET
          name = $1,
          updated_at = TIMEZONE('utc', NOW())
        WHERE
          name = $2
        RETURNING
          *
      ;`,
      values: [storeInputValues.name, oldName],
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
  addFeatures,
};

export default store;
