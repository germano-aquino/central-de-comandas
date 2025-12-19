import database from "infra/database";
import user from "./user";
import { NotFoundError, ValidationError } from "infra/errors";

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
}

async function update(categoryName, categoryInputValues) {
  await findOneValidByName(categoryName);
  if (
    "name" in categoryInputValues &&
    categoryName.toLowerCase() !== categoryInputValues.name.toLowerCase()
  ) {
    await validateUniqueName(categoryInputValues);
  }

  const updatedCategory = await runUpdateQuery(
    categoryName,
    categoryInputValues.name,
  );
  return updatedCategory;

  async function runUpdateQuery(oldName, newName) {
    const results = await database.query({
      text: `
        UPDATE
          service_categories
        SET
          name = $2,
          updated_at = TIMEZONE('utc', NOW())
        WHERE
          name = $1
        RETURNING
          *
      ;`,
      values: [oldName, newName],
    });

    return results.rows[0];
  }
}

async function deleteManyByIdArray(categoryIds) {
  const deletedCategories = await runDeleteQuery(categoryIds);

  return deletedCategories;

  async function runDeleteQuery(categoryIds) {
    const results = await database.query({
      text: `
        DELETE FROM
          service_categories
        WHERE
          id = ANY($1)
        RETURNING
          *
      ;`,
      values: [categoryIds],
    });

    return results.rows;
  }
}

async function deleteByName(categoryName) {
  await findOneValidByName(categoryName);
  const deletedCategory = await runDeleteQuery(categoryName);
  return deletedCategory;

  async function runDeleteQuery(categoryName) {
    console.log(categoryName);
    const results = await database.query({
      text: `
        DELETE FROM
          service_categories
        WHERE
          LOWER(name) = LOWER($1)
        RETURNING
          *
      ;`,
      values: [categoryName],
    });

    return results.rows[0];
  }
}

async function findOneValidByName(categoryName) {
  const results = await database.query({
    text: `
        SELECT
          *
        FROM
          service_categories
        WHERE
          LOWER(name) = LOWER($1)
        LIMIT
          1
      ;`,
    values: [categoryName],
  });

  if (results.rowCount === 0) {
    throw new NotFoundError({
      message: "Esta categoria não existe.",
      action: "Verifique o nome da categoria e tente novamente.",
    });
  }
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

async function retrieveAllCategories() {
  const storedCategories = await runSelectQuery();
  return storedCategories;

  async function runSelectQuery() {
    const results = await database.query({
      text: `
        SELECT
          *
        FROM
          service_categories
      ;`,
    });

    return results.rows;
  }
}

async function setCategoriesFeatures(forbiddenUser) {
  const allowedUser = user.addFeaturesByUserId(forbiddenUser.id, [
    "create:category",
    "read:category",
    "edit:category",
    "delete:category",
  ]);
  return allowedUser;
}

const category = {
  create,
  update,
  deleteByName,
  deleteManyByIdArray,
  findOneValidByName,
  retrieveAllCategories,
  setCategoriesFeatures,
};

export default category;
