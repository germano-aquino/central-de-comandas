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
          (name, price, category_id, is_mold)
        VALUES
          ($1, $2, $3, $4)
        RETURNING
          *
      ;`,
      values: [
        serviceInputValues.name,
        serviceInputValues.price,
        serviceInputValues.category_id,
        serviceInputValues.is_mold,
      ],
    });

    return results.rows[0];
  }

  async function validateInputValues(serviceInputValues) {
    if (
      "category_id" in serviceInputValues &&
      serviceInputValues.category_id !== null
    ) {
      await findCategoryValidById(serviceInputValues.category_id);
    } else {
      serviceInputValues.category_id = null;
    }

    if (!("is_mold" in serviceInputValues)) {
      serviceInputValues.is_mold = false;
    }

    if (typeof serviceInputValues.is_mold !== "boolean") {
      throw new ValidationError({
        message: "O tipo da propriedade is_mold é inválido.",
        action:
          "Modifique a propriedade is_mold para um booleano e tente novamente.",
      });
    }

    if (!("price" in serviceInputValues)) {
      throw new ValidationError({
        message: "A propriedade price está ausente.",
        action:
          "Envie uma propriedade price com o preço do serviço em centavos.",
      });
    }

    if (
      !Number.isInteger(serviceInputValues.price) ||
      serviceInputValues.price <= 0
    ) {
      throw new ValidationError({
        message: "A propriedade price deve ser um número inteiro positivo.",
        action:
          "Envie uma propriedade price com o preço do serviço em centavos.",
      });
    }

    await validateUniqueName(serviceInputValues.name);
  }
}

async function update(serviceName, serviceInputValues) {
  const newServiceValues = await getValidNewServiceValues(
    serviceName,
    serviceInputValues,
  );

  const updatedService = runUpdateQuery(serviceName, newServiceValues);
  return updatedService;

  async function getValidNewServiceValues(currentName, serviceInputValues) {
    const currentService = await findOneValidByName(serviceName);

    if ("name" in serviceInputValues) {
      const inputServiceName = serviceInputValues.name;
      if (currentName.toLowerCase() !== inputServiceName.toLowerCase()) {
        await validateUniqueName(serviceInputValues.name);
      }
    }

    if ("category_id" in serviceInputValues) {
      await findCategoryValidById(serviceInputValues.category_id);
    }

    const newServiceValues = { ...currentService, ...serviceInputValues };
    return newServiceValues;
  }

  async function runUpdateQuery(currentName, newServiceValues) {
    const results = await database.query({
      text: `
        UPDATE
          services
        SET
          name = $2,
          price = $3,
          category_id = $4,
          updated_at = TIMEZONE('utc', NOW())
        WHERE
          LOWER(name) = LOWER($1)
        RETURNING
          *
      ;`,
      values: [
        currentName,
        newServiceValues.name,
        newServiceValues.price,
        newServiceValues.category_id,
      ],
    });

    return results.rows[0];
  }
}

async function updateManyByIdArray(serviceInputValues) {
  await validateInputValues(serviceInputValues);

  const updatedServices = await runUpdateQuery(serviceInputValues);

  return updatedServices;

  async function validateInputValues(serviceInputValues) {
    if ("name" in serviceInputValues) {
      throw new ValidationError({
        message:
          "Não é possível editar o nome de múltiplos serviços com uma única requisição.",
        action: "Retire a propriedade nome da requisição e tente novamente.",
      });
    }

    if ("category_id" in serviceInputValues) {
      await findCategoryValidById(serviceInputValues.category_id);
    }

    if ("is_mold" in serviceInputValues) {
      if (typeof serviceInputValues.is_mold !== "boolean") {
        throw new ValidationError({
          message: "O tipo da propriedade is_mold é inválido.",
          action:
            "Modifique a propriedade is_mold para um booleano e tente novamente.",
        });
      }
    }
  }

  async function runUpdateQuery(serviceInputValues) {
    const serviceIds = serviceInputValues?.service_ids || [];
    const price = serviceInputValues?.price || null;
    const categoryId = serviceInputValues?.category_id || null;
    const isMold = serviceInputValues?.is_mold || null;

    const results = await database.query({
      text: `
        UPDATE
          services
        SET
          price = COALESCE($2, price),
          category_id = COALESCE($3, category_id),
          is_mold = COALESCE($4, is_mold),
          updated_at = TIMEZONE('utc', NOW())
        WHERE
          id = ANY($1)
        RETURNING
          *
      ;`,
      values: [serviceIds, price, categoryId, isMold],
    });

    return results.rows;
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

async function deleteOneByName(serviceName) {
  await findOneValidByName(serviceName);
  const deletedService = await runDeleteQuery(serviceName);

  return deletedService;

  async function runDeleteQuery(serviceName) {
    const results = await database.query({
      text: `
        DELETE FROM
          services
        WHERE
          LOWER(name) = LOWER($1)
        RETURNING
          *
      ;`,
      values: [serviceName],
    });

    return results.rows[0];
  }
}

async function deleteManyByIdArray(serviceIds) {
  const deletedServices = await runDeleteQuery(serviceIds);

  return deletedServices;

  async function runDeleteQuery(serviceIds) {
    const results = await database.query({
      text: `
        DELETE FROM
          services
        WHERE
          id = ANY($1)
        RETURNING
          *
      ;`,
      values: [serviceIds],
    });

    return results.rows;
  }
}

async function retrieveAll(categoryName, isMold) {
  const storedServices = await runSelectQuery(categoryName, isMold);

  return storedServices;

  async function runSelectQuery(categoryName) {
    let query = "SELECT * FROM services WHERE TRUE";
    let values = [];

    if (categoryName) {
      const categoryId = await getCategoryIdByName(categoryName);
      values.push(categoryId);
      query += ` AND category_id = $${values.length}`;
    }

    if (isMold) {
      const validIsMold = getValidBoolean(isMold);
      values.push(validIsMold);
      query += ` AND is_mold = $${values.length}`;
    }

    query += ";";

    const results = await database.query({
      text: query,
      values,
    });

    return results.rows;
  }

  async function getCategoryIdByName(categoryName) {
    try {
      const selectedCategory = await category.findOneValidByName(categoryName);

      return selectedCategory.id;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new ValidationError(error);
      }

      throw error;
    }
  }

  function getValidBoolean(isMold) {
    if (isMold.toLowerCase() === "true") return true;
    if (isMold.toLowerCase() === "false") return false;
    if (typeof isMold === "boolean") return isMold;
    throw new ValidationError({
      message: "Propriedade is_mold deve ser um booleano.",
      action: "Envie um booleano como query params e tente novamente.",
    });
  }
}

async function findCategoryValidById(categoryId) {
  try {
    return await category.findOneValidById(categoryId);
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw new ValidationError(error);
    }

    throw error;
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

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "Este serviço não existe.",
        action: "Verifique o nome do serviço e tente novamente.",
      });
    }

    return results.rows[0];
  }
}

async function findOneValidById(serviceId) {
  const serviceFound = await runSelectQuery(serviceId);
  return serviceFound;

  async function runSelectQuery(serviceId) {
    const results = await database.query({
      text: `
        SELECT
          *
        FROM
          services
        WHERE
          id = $1
        LIMIT
          1
      ;`,
      values: [serviceId],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "Este serviço não existe.",
        action: "Verifique o id do serviço e tente novamente.",
      });
    }

    return results.rows[0];
  }
}

async function addFeatures(forbiddenUser) {
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
  update,
  updateManyByIdArray,
  deleteOneByName,
  deleteManyByIdArray,
  retrieveAll,
  findOneValidByName,
  findOneValidById,
  addFeatures,
};

export default service;
