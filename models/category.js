import database from "infra/database";
import user from "./user";
import { ValidationError } from "infra/errors";

async function create(categoryInputValues) {
  await validateUniqueName(categoryInputValues.name);

  const categoryCreated = await runInsertQuery(categoryInputValues.name);
  return categoryCreated;

  async function runInsertQuery(categoryName) {
    const results = await database.query({
      text: `
        INSERT INTO
          service_categories
          (name)
        VALUES
          ($1)
        RETURNING
          *
      ;`,
      values: [categoryName],
    });

    return results.rows[0];
  }

  async function validateUniqueName(categoryName) {
    const results = await database.query({
      text: `
        SELECT
          name
        FROM
          service_categories
        WHERE
          LOWER(name) = LOWER($1)
        LIMIT
          1
      ;`,
      values: [categoryName],
    });

    if (results.rowCount > 0) {
      throw new ValidationError({
        message: "Esta categoria já existe.",
        action: "Escolha um novo nome para a categoria e tente novamente.",
      });
    }
  }
}

async function setCategoriesFeatures(forbiddenUser) {
  const allowedUser = user.addFeaturesByUserId(forbiddenUser.id, [
    "create:category",
  ]);
  return allowedUser;
}

const category = { create, setCategoriesFeatures };

export default category;
