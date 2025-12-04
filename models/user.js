import database from "infra/database";
import { NotFoundError, ValidationError } from "infra/errors";
import password from "./password";

async function create(userInputValues) {
  await validateUniqueEmail(userInputValues.email);
  await validateUniqueUsername(userInputValues.username);
  await hashPasswordInObject(userInputValues);

  const createdUser = await runInsertQuery(userInputValues);
  return createdUser;

  async function runInsertQuery(userInputValues) {
    const results = await database.query({
      text: `
        INSERT INTO
          users
          (username, email, password)
        VALUES
          ($1, $2, $3)
        RETURNING
          *
      ;`,
      values: [
        userInputValues.username,
        userInputValues.email,
        userInputValues.password,
      ],
    });

    return results.rows[0];
  }
}

async function update(username, userInputValues) {
  const currentUser = await findOneByUsername(username);

  if ("username" in userInputValues) {
    const newUsername = userInputValues.username;
    if (newUsername.toLowerCase() !== username.toLowerCase()) {
      await validateUniqueUsername(userInputValues.username);
    }
  }

  if ("email" in userInputValues) {
    await validateUniqueEmail(userInputValues.email);
  }

  if ("password" in userInputValues) {
    await hashPasswordInObject(userInputValues);
  }

  const userWithNewValues = { ...currentUser, ...userInputValues };
  const updatedUser = await runUpdateQuery(userWithNewValues);

  return updatedUser;

  async function runUpdateQuery(userInputValues) {
    const results = await database.query({
      text: `
        UPDATE
          users
        SET
          username = $2,
          email = $3,
          password = $4,
          updated_at = timezone('utc', now())
        WHERE
          id = ($1)
        RETURNING
          *
      ;`,
      values: [
        userInputValues.id,
        userInputValues.username,
        userInputValues.email,
        userInputValues.password,
      ],
    });

    return results.rows[0];
  }
}

async function validateUniqueEmail(email) {
  const results = await database.query({
    text: `
        SELECT
          email
        FROM
          users
        WHERE
          LOWER(email) = LOWER($1)
        LIMIT
          1
      ;`,
    values: [email],
  });

  if (results.rowCount) {
    throw new ValidationError({
      message: "O email informado já está sendo utilizado.",
      action: "Escolha um novo email para realizar esta operação.",
    });
  }
}

async function validateUniqueUsername(username) {
  const results = await database.query({
    text: `
        SELECT
          username
        FROM
          users
        WHERE
          LOWER(username) = LOWER($1)
        LIMIT
          1
      ;`,
    values: [username],
  });

  if (results.rowCount) {
    throw new ValidationError({
      message: "O username informado já está sendo utilizado.",
      action: "Escolha um novo username para realizar esta operação.",
    });
  }
}

async function hashPasswordInObject(userInputValues) {
  const hashPassword = await password.hash(userInputValues.password);

  userInputValues.password = hashPassword;
}

async function findOneByUsername(username) {
  const userFound = await runSelectQuery(username);

  return userFound;

  async function runSelectQuery(username) {
    const results = await database.query({
      text: `
        SELECT
          *
        FROM
          users
        WHERE
          LOWER(username) = LOWER($1)
        LIMIT
          1
      ;`,
      values: [username],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "O username não foi encontrado.",
        action: "Verifique se o username está correto e tente novamente.",
      });
    }

    return results.rows[0];
  }
}

async function findOneByEmail(email) {
  const userFound = await runSelectQuery(email);

  return userFound;

  async function runSelectQuery(email) {
    const results = await database.query({
      text: `
        SELECT
          *
        FROM
          users
        WHERE
          LOWER(email) = LOWER($1)
        LIMIT
          1
      ;`,
      values: [email],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "O email não foi encontrado.",
        action: "Verifique se o email está correto e tente novamente.",
      });
    }

    return results.rows[0];
  }
}

async function findOneById(id) {
  const userFound = await runSelectQuery(id);

  return userFound;

  async function runSelectQuery(id) {
    const results = await database.query({
      text: `
        SELECT
          *
        FROM
          users
        WHERE
          id = $1
        LIMIT
          1
      ;`,
      values: [id],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "O id informado não foi encontrado no sistema.",
        action:
          "Verifique se o id foi digitado corretamente e tente novamente.",
      });
    }

    return results.rows[0];
  }
}

const user = { create, update, findOneByUsername, findOneByEmail, findOneById };

export default user;
