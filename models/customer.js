import { NotFoundError, ValidationError } from "@/infra/errors";
import user from "./user";
import database from "@/infra/database";

async function create(customerInputValues) {
  const validInputValues =
    await getValidCustomerInputValues(customerInputValues);

  const newCustomer = await runInsertQuery(validInputValues);
  return newCustomer;

  async function getValidCustomerInputValues(inputValues) {
    let validInputValues = {};

    if ("name" in inputValues && inputValues.name.trim()) {
      await validateUniqueName(inputValues.name);
    } else {
      throw new ValidationError({
        message:
          "Não é possível criar novo cliente. Campo nome do cliente está inválido.",
        action: "Inclua um valor não vazio para o campo nome do cliente.",
      });
    }
    validInputValues.name = inputValues.name;

    if ("phone" in inputValues && inputValues.phone.trim()) {
      const validPhone = getValidPhoneNumber(inputValues.phone);
      await validateUniquePhone(validPhone);
      validInputValues.phone = validPhone;
    } else {
      throw new ValidationError({
        message:
          "Não é possível criar novo cliente. Campo número de telefone do cliente está inválido.",
        action:
          "Inclua um valor com o seguinte formato '+55 91 987654231' para o campo número de telefone do cliente.",
      });
    }

    return validInputValues;
  }

  async function runInsertQuery(inputValues) {
    const results = await database.query({
      text: `
        INSERT INTO
          customers
          (name, phone)
        VALUES
          ($1, $2)
        RETURNING
          *
      ;`,
      values: [inputValues.name, inputValues.phone],
    });

    return results.rows[0];
  }
}

async function update(customerInputValues, storedName) {
  const validValues = await getValidInputValues(
    customerInputValues,
    storedName,
  );

  const updatedCustomer = await runUpdateQuery(validValues, storedName);
  return updatedCustomer;

  async function getValidInputValues(inputValues, oldName) {
    try {
      let validValues = {};
      await findOneValidByName(oldName);

      if ("name" in inputValues) {
        const newName = inputValues.name;
        if (newName.toLowerCase() != oldName.toLowerCase())
          await validateUniqueName(newName);
        validValues.name = newName;
      } else {
        validValues.name = null;
      }

      if ("phone" in inputValues) {
        const validPhone = getValidPhoneNumber(inputValues.phone);
        await validateUniquePhone(validPhone);
        validValues.phone = validPhone;
      } else {
        validValues.phone = null;
      }

      return validValues;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new ValidationError(error);
      }
      throw error;
    }
  }

  async function runUpdateQuery(inputValues, oldName) {
    const results = await database.query({
      text: `
        UPDATE
          customers
        SET
          name = COALESCE($1, name),
          phone = COALESCE($2, phone),
          updated_at = TIMEZONE('utc', NOW())
        WHERE
          LOWER(name) = LOWER($3)
        RETURNING
          *
      ;`,
      values: [inputValues.name, inputValues.phone, oldName],
    });

    return results.rows[0];
  }
}

function getValidPhoneNumber(phoneNumber) {
  const phoneNumberPattern = new RegExp(
    "[\\+][(]?[0-9]{1,3}[)]?[-\\s\\.]?[0-9]{2,3}[-\\s\\.]?[0-9]{4,5}[-\\s\\.]?[0-9]{4}",
  );
  if (!phoneNumberPattern.test(phoneNumber)) {
    throw new ValidationError({
      message: "Número de telefone inválido.",
      action:
        "Envie um número de telefone com o seguinte formato: '+55 91 98765-4321'.",
    });
  }
  const validPhoneNumber = phoneNumber.replace(/[^\\+0-9]/g, "");
  return validPhoneNumber;
}

async function validateUniquePhone(phone) {
  const results = await database.query({
    text: `
        SELECT
          *
        FROM
          customers
        WHERE
          LOWER(phone) = LOWER($1)
        LIMIT
          1
      ;`,
    values: [phone],
  });

  if (results.rowCount > 0) {
    throw new ValidationError({
      message:
        "O número de telefone escolhido para o cliente já está sendo utilizado.",
      action:
        "Escolha um novo número de telefone para o cliente e tente novamente.",
    });
  }
}
async function validateUniqueName(customerName) {
  const results = await database.query({
    text: `
        SELECT
          *
        FROM
          customers
        WHERE
          LOWER(name) = LOWER($1)
        LIMIT
          1
      ;`,
    values: [customerName],
  });

  if (results.rowCount > 0) {
    throw new ValidationError({
      message: "O nome escolhido para o cliente já está sendo utilizado.",
      action: "Escolha um novo nome para o cliente e tente novamente.",
    });
  }
}

async function retrieveAll(name, phone) {
  const storedCustomers = await runSelectQuery(name, phone);
  return storedCustomers;

  async function runSelectQuery(name, phone) {
    let text = `SELECT * FROM customers WHERE TRUE`;
    let values = [];
    if (name) {
      values.push("%" + name + "%");
      text += ` AND LOWER(name) LIKE $${values.length}`;
    }

    if (phone) {
      values.push(phone + "%");
      text += ` AND phone LIKE $${values.length}`;
    }

    text += ";";

    const results = await database.query({
      text,
      values,
    });

    return results.rows;
  }
}

async function deleteOneByName(customerName) {
  await findOneValidByName(customerName);
  const deltedCustomer = await runDeleteQuery(customerName);
  return deltedCustomer;

  async function runDeleteQuery(customerName) {
    const results = await database.query({
      text: `
        DELETE FROM
          customers
        WHERE
          LOWER(name) = LOWER($1)
        RETURNING
          *
      ;`,
      values: [customerName],
    });

    return results.rows[0];
  }
}

async function deleteManyByIdArray(customerIds) {
  const deletedCustomers = await runDeleteQuery(customerIds);
  return deletedCustomers;

  async function runDeleteQuery(customerIds) {
    const results = await database.query({
      text: `
        DELETE FROM
          customers
        WHERE
          id = ANY($1)
        RETURNING
          *
      ;`,
      values: [customerIds],
    });

    return results.rows;
  }
}

async function findOneValidByName(name) {
  const results = await database.query({
    text: `
      SELECT
        *
      FROM
        customers
      WHERE
        LOWER(name) = LOWER($1)
      LIMIT
        1
      ;`,
    values: [name],
  });

  if (results.rowCount < 1) {
    throw new NotFoundError({
      message: "Não existe cliente com esse nome.",
      action: "Verifique se o nome está correto e tente novamente.",
    });
  }

  return results.rows[0];
}

async function addFeatures(unallowedUser) {
  const allowedUser = user.addFeaturesByUserId(unallowedUser.id, [
    "create:customer",
    "edit:customer",
    "read:customer",
    "delete:customer",
  ]);
  return allowedUser;
}

const customer = {
  create,
  update,
  retrieveAll,
  deleteOneByName,
  deleteManyByIdArray,
  findOneValidByName,
  addFeatures,
};

export default customer;
