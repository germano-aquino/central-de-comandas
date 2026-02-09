import { ValidationError } from "@/infra/errors";
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
  addFeatures,
};

export default customer;
