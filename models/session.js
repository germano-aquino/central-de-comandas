import database from "infra/database";
import crypto from "node:crypto";

const EXPIRATION_IN_MILLISECONDS = 12 * 60 * 60 * 1000; // 12 hours

async function create(userId) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + EXPIRATION_IN_MILLISECONDS);

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

const session = { create, EXPIRATION_IN_MILLISECONDS };

export default session;
