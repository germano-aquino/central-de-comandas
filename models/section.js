import database from "infra/database";
import { NotFoundError, ValidationError } from "infra/errors";

async function create(sectionInputValues, sectionType) {
  await validateUniqueName(sectionInputValues.name, sectionType);

  const sectionCreated = await runInsertQuery(
    sectionInputValues.name,
    sectionType,
  );
  return sectionCreated;

  async function runInsertQuery(sectionName, sectionType) {
    let query = appendTableName("INSERT INTO ", sectionType);
    query += " (name) VALUES ($1) RETURNING *;";

    const results = await database.query({
      text: query,
      values: [sectionName],
    });

    return results.rows[0];
  }
}

async function update(sectionName, sectionInputValues, sectionType) {
  await findOneValidByName(sectionName, sectionType);
  if (
    "name" in sectionInputValues &&
    sectionName.toLowerCase() !== sectionInputValues.name.toLowerCase()
  ) {
    await validateUniqueName(sectionInputValues, sectionType);
  }

  const updatedCategory = await runUpdateQuery(
    sectionName,
    sectionInputValues.name,
    sectionType,
  );
  return updatedCategory;

  async function runUpdateQuery(oldName, newName, sectionType) {
    let query = appendTableName("UPDATE ", sectionType);
    query +=
      " SET name = $2, updated_at = TIMEZONE('utc', NOW()) WHERE name = $1 RETURNING * ;";

    const results = await database.query({
      text: query,
      values: [oldName, newName],
    });

    return results.rows[0];
  }
}

async function deleteManyByIdArray(sectionIds, sectionType) {
  const deletedCategories = await runDeleteQuery(sectionIds, sectionType);

  return deletedCategories;

  async function runDeleteQuery(sectionIds, sectionType) {
    let query = appendTableName("DELETE FROM ", sectionType);
    query += " WHERE id = ANY($1) RETURNING * ;";

    const results = await database.query({
      text: query,
      values: [sectionIds],
    });

    return results.rows;
  }
}

async function deleteByName(sectionName, sectionType) {
  await findOneValidByName(sectionName, sectionType);
  const deletedCategory = await runDeleteQuery(sectionName, sectionType);
  return deletedCategory;

  async function runDeleteQuery(sectionName, sectionType) {
    let query = appendTableName("DELETE FROM ", sectionType);
    query += " WHERE LOWER(name) = LOWER($1) RETURNING * ;";

    const results = await database.query({
      text: query,
      values: [sectionName],
    });

    return results.rows[0];
  }
}

async function findOneValidByName(sectionName, sectionType) {
  let query = appendTableName("SELECT * FROM ", sectionType);
  query += " WHERE LOWER(name) = LOWER($1) LIMIT 1;";

  const results = await database.query({
    text: query,
    values: [sectionName],
  });

  if (results.rowCount === 0) {
    throw new NotFoundError({
      message: "Esta seção não existe.",
      action: "Verifique o nome da seção e tente novamente.",
    });
  }
  return results.rows[0];
}

async function findOneValidById(sectionId, sectionType) {
  let query = appendTableName("SELECT * FROM ", sectionType);
  query += " WHERE id = $1 LIMIT 1;";

  const results = await database.query({
    text: query,
    values: [sectionId],
  });

  if (results.rowCount === 0) {
    throw new NotFoundError({
      message: "Esta seção não existe.",
      action: "Verifique o id da seção e tente novamente.",
    });
  }
  return results.rows[0];
}

async function validateUniqueName(sectionName, sectionType) {
  let query = appendTableName("SELECT name FROM ", sectionType);
  query += " WHERE LOWER(name) = LOWER($1) LIMIT 1;";

  const results = await database.query({
    text: query,
    values: [sectionName],
  });

  if (results.rowCount > 0) {
    throw new ValidationError({
      message: "Este nome já está sendo utilizado.",
      action: "Escolha um novo nome e tente novamente.",
    });
  }
}

async function retrieveAll(sectionType) {
  const storedSections = await runSelectQuery(sectionType);
  return storedSections;

  async function runSelectQuery() {
    let query = appendTableName("SELECT * FROM ", sectionType);
    query += " ;";

    const results = await database.query({ text: query });

    return results.rows;
  }
}

function appendTableName(query, sectionType) {
  let newQuery;
  switch (sectionType) {
    case "service":
      newQuery = query + "service_sections";
      break;
    case "form":
      newQuery = query + "form_sections";
      break;
    default:
      throw new ValidationError({
        message: "Tipo da seção inválido.",
        action: "Escolha um tipo de seção válido.",
      });
  }

  return newQuery;
}

const section = {
  create,
  update,
  deleteByName,
  deleteManyByIdArray,
  findOneValidByName,
  findOneValidById,
  retrieveAll,
};

export default section;
