import database from "infra/database";
import user from "./user";
import category from "./category";
import { NotFoundError, ValidationError } from "infra/errors";

async function create(serviceInputValues) {
  if ("category_id" in serviceInputValues) {
    await validateCategoryExistense(serviceInputValues.category_id);
  } else {
    serviceInputValues.category_id = null;
  }
  await validateUniqueName(serviceInputValues.name);

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

  async function validateCategoryExistense(categoryId) {
    try {
      await category.findOneValidById(categoryId);
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

async function addServicesFeatures(forbiddenUser) {
  const allowedUser = user.addFeaturesByUserId(forbiddenUser.id, [
    "create:service",
    "read:service",
    "edit:service",
    "delete:service",
  ]);
  return allowedUser;
}

const service = { create, addServicesFeatures };

export default service;
