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
        throw new ValidationError(error);
      }

      throw error;
    }
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

    try {
      if ("name" in serviceInputValues) {
        const inputServiceName = serviceInputValues.name;
        if (currentName.toLowerCase() !== inputServiceName.toLowerCase()) {
          await validateUniqueName(serviceInputValues.name);
        }
      }

      if ("category_id" in serviceInputValues) {
        await category.findOneValidById(serviceInputValues.category_id);
      }

      const newServiceValues = { ...currentService, ...serviceInputValues };
      return newServiceValues;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new ValidationError(error);
      }

      throw error;
    }
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
    try {
      if ("name" in serviceInputValues) {
        throw new ValidationError({
          message:
            "Não é possível editar o nome de múltiplos serviços com uma única requisição.",
          action: "Retire a propriedade nome da requisição e tente novamente.",
        });
      }

      if ("category_id" in serviceInputValues) {
        await category.findOneValidById(serviceInputValues.category_id);
      }
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new ValidationError(error);
      }

      throw error;
    }
  }

  async function runUpdateQuery(serviceInputValues) {
    const serviceIds = serviceInputValues?.service_ids || [];
    const price = serviceInputValues?.price || null;
    const categoryId = serviceInputValues?.category_id || null;

    const results = await database.query({
      text: `
        UPDATE
          services
        SET
          price = COALESCE($2, price),
          category_id = COALESCE($3, category_id),
          updated_at = TIMEZONE('utc', NOW())
        WHERE
          id = ANY($1)
        RETURNING
          *
      ;`,
      values: [serviceIds, price, categoryId],
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

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "Este serviço não existe.",
        action: "Verifique o nome do serviço e tente novamente.",
      });
    }

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
  update,
  updateManyByIdArray,
  retrieveAll,
  findOneValidByName,
  addServicesFeatures,
};

export default service;
