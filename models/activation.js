import database from "infra/database";
import email from "infra/email";
import { NotFoundError } from "infra/errors";
import user from "./user";
import webserver from "infra/webserver";

const EXPIRATION_IN_MILLISECONDS = 15 * 60 * 1000; // 15 minutes

async function create(userToBeCreated) {
  const activationObject = await runInsertQuery(userToBeCreated.id);
  return activationObject;

  async function runInsertQuery(userId) {
    const expiresAt = new Date(Date.now() + EXPIRATION_IN_MILLISECONDS);
    const results = await database.query({
      text: `
        INSERT INTO
          user_activation_tokens
          (user_id, expires_at)
        VALUES
          ($1, $2)
        RETURNING
          *
      ;`,
      values: [userId, expiresAt],
    });

    return results.rows[0];
  }
}

async function sendActivationEmail(user, activationToken) {
  const activationEmail = {
    from: "<contato@curso.dev>",
    to: [`<${user.email}>`],
    subject: "Email de Ativação de Cadastro na Central de Comandas",
    text: `Bem vindo ${user.username}, para confirmar a sua conta clique no link de ativação abaixo:
    
${webserver.origin}/cadastro/ativar/${activationToken}

Att,`,
  };

  await email.send(activationEmail);
}

async function markTokenAsUsed(activatedToken) {
  const usedToken = await runUpdateQuery(activatedToken.id);
  return usedToken;

  async function runUpdateQuery(tokenId) {
    const results = await database.query({
      text: `
        UPDATE
          user_activation_tokens
        SET
          used_at = TIMEZONE('utc', NOW()),
          updated_at = TIMEZONE('utc', NOW())
        WHERE
          id = $1
          AND expires_at > NOW()
          AND used_at IS NULL
        RETURNING
          *
      ;`,
      values: [tokenId],
    });

    return results.rows[0];
  }
}

async function activateUserByUserId(userId) {
  await user.setFeaturesByUserId(userId, ["read:session", "create:session"]);
}

async function findOneValidByUserId(userId) {
  const activationToken = await runSelectQuery(userId);
  return activationToken;

  async function runSelectQuery(userId) {
    const results = await database.query({
      text: `
        SELECT
          *
        FROM
          user_activation_tokens
        WHERE
          user_id = $1
          AND expires_at > NOW()
        LIMIT
          1
      ;`,
      values: [userId],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message:
          "O token de ativação deste usuário não existe ou está expirado.",
        action: "Peça para reenviar o email de ativação.",
      });
    }
    return results.rows[0];
  }
}

async function findOneValidById(tokenId) {
  const activationToken = await runSelectQuery(tokenId);
  return activationToken;

  async function runSelectQuery(tokenId) {
    const results = await database.query({
      text: `
        SELECT
          *
        FROM
          user_activation_tokens
        WHERE
          id = $1
          AND expires_at > NOW()
        LIMIT
          1
      ;`,
      values: [tokenId],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message:
          "O token de ativação deste usuário não existe ou está expirado.",
        action: "Peça para reenviar o email de ativação.",
      });
    }
    return results.rows[0];
  }
}

const activation = {
  create,
  sendActivationEmail,
  activateUserByUserId,
  markTokenAsUsed,
  findOneValidByUserId,
  findOneValidById,
};

export default activation;
