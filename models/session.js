import database from "infra/database";
import { UnauthorizedError } from "infra/errors";
import crypto from "node:crypto";

const EXPIRATION_IN_MILLISECONDS = 12 * 60 * 60 * 1000; // 12 hours

async function create(userId) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = getExpiresAtDate();

  const sessionObject = await runInsertQuery(userId, token, expiresAt);
  return sessionObject;

  async function runInsertQuery(userId, token, expiresAt) {
    const results = await database.query({
      text: `
        INSERT INTO
          sessions
          (user_id, token, expires_at)
        VALUES
          ($1, $2, $3)
        RETURNING
          *
      ;`,
      values: [userId, token, expiresAt],
    });

    return results.rows[0];
  }
}

async function renew(currentSession) {
  const expiresAt = getExpiresAtDate();
  const renewedSession = await runUpdateQuery(currentSession.id, expiresAt);

  return renewedSession;

  async function runUpdateQuery(sessionId, expiresAt) {
    const results = await database.query({
      text: `
        UPDATE
          sessions
        SET
          updated_at = TIMEZONE('utc', NOW()),
          expires_at = $2
        WHERE
          id = $1
          AND expires_at > TIMEZONE('utc', NOW())
        RETURNING
          *
      ;`,
      values: [sessionId, expiresAt],
    });

    throwErrorIfTokenIsInvalid(results.rowCount);

    return results.rows[0];
  }
}

async function expireById(sessionId) {
  const expiredSession = await runUpdateQuery(sessionId);
  return expiredSession;

  async function runUpdateQuery(sessionId) {
    const results = await database.query({
      text: `
        UPDATE
          sessions
        SET
          expires_at = expires_at - interval '1 year',
          updated_at = TIMEZONE('utc', NOW())
        WHERE
          id = $1
        RETURNING
         *
      ;`,
      values: [sessionId],
    });

    return results.rows[0];
  }
}

async function findOneValidByToken(sessionToken) {
  const validSession = await runSelectQuery(sessionToken);
  return validSession;

  async function runSelectQuery(sessionToken) {
    const results = await database.query({
      text: `
        SELECT
          *
        FROM
          sessions
        WHERE
          token = $1
          AND expires_at > TIMEZONE('utc', NOW())
        LIMIT
          1
      ;`,
      values: [sessionToken],
    });

    throwErrorIfTokenIsInvalid(results.rowCount);

    return results.rows[0];
  }
}

function getExpiresAtDate() {
  return new Date(Date.now() + EXPIRATION_IN_MILLISECONDS);
}

function throwErrorIfTokenIsInvalid(NumberOfTokensFound) {
  if (NumberOfTokensFound === 0) {
    throw new UnauthorizedError({
      message: "Usuário não possui sessão ativa.",
      action: "Verifique se o usuário está logado e tente novamente.",
    });
  }
}

const session = {
  create,
  renew,
  expireById,
  findOneValidByToken,
  EXPIRATION_IN_MILLISECONDS,
};

export default session;
