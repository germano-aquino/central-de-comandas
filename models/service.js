import database from "infra/database";
import user from "./user";
import category from "./category";
import { NotFoundError, ValidationError } from "infra/errors";

async function create(serviceInputValues) {
  await validateInputValues(serviceInputValues);

  const createdService = await runInsertQuery(serviceInputValues);
  return createdService;

  async function runInsertQuery(serviceInputValues) {
    const results = await database.query({
      text: `
        INSERT INTO
          services
          (name, price, category_id)
        VALUES
          ($1, $2, $3)
        RETURNING
          *
      ;`,
      values: [
        serviceInputValues.name,
        serviceInputValues.price,
        serviceInputValues.category_id,
      ],
    });

    return results.rows[0];
  }

  async function validateInputValues(serviceInputValues) {
    try {
      if (
        "category_id" in serviceInputValues &&
        serviceInputValues.category_id !== null
      ) {
        await category.findOneValidById(serviceInputValues.category_id);
      } else {
        serviceInputValues.category_id = null;
      }

      await validateUniqueName(serviceInputValues.name);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new ValidationError({
          message: error.message,
          action: error.action,
          cause: error,
        });
      }

      throw error;
    }
  }

  async function validateUniqueName(serviceName) {
    const results = await database.query({
      text: `
        SELECT
          *
        FROM
          services
        WHERE
          LOWER(name) = LOWER($1)
      ;`,
      values: [serviceName],
    });

    if (results.rowCount > 0) {
      throw new ValidationError({
        message: "Já existe um serviço com esse nome.",
        action: "Escolha um novo nome para o serviço e tente novamente.",
      });
    }
  }
}

async function retrieveAll() {
  const storedServices = await runSelectQuery();
  return storedServices;

  async function runSelectQuery() {
    const results = await database.query(`
      SELECT
        *
      FROM
        services
      ;`);

    return results.rows;
  }
}

async function findOneValidByName(serviceName) {
  const serviceFound = await runSelectQuery(serviceName);
  return serviceFound;

  async function runSelectQuery(serviceName) {
    const results = await database.query({
      text: `
        SELECT
          *
        FROM
          services
        WHERE
          LOWER(name) = LOWER($1)
        LIMIT
          1
      ;`,
      values: [serviceName],
    });

    return results.rows[0];
  }
}

async function addServicesFeatures(forbiddenUser) {
  const allowedUser = user.addFeaturesByUserId(forbiddenUser.id, [
    "create:service",
    "read:service",
    "edit:service",
    "delete:service",
  ]);
  return allowedUser;
}

const service = {
  create,
  retrieveAll,
  findOneValidByName,
  addServicesFeatures,
};

export default service;
