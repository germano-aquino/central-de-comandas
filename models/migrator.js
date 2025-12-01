import database from "infra/database";
import { ServiceError } from "infra/errors";

import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";

const migrationsConfig = {
  dryRun: true,
  dir: resolve("infra", "migrations"),
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
};

async function runPendingMigrations() {
  let client;

  try {
    client = await database.getNewClient();
    const migratedMigrations = await migrationRunner({
      ...migrationsConfig,
      dbClient: client,
      dryRun: false,
    });
    return migratedMigrations;
  } catch (error) {
    const serviceErrorObject = new ServiceError({
      message: "Serviço de migração indisponível.",
      cause: error,
    });

    console.error(serviceErrorObject);
    throw serviceErrorObject;
  } finally {
    client?.end();
  }
}

async function listPendingMigrations() {
  let client;

  try {
    client = await database.getNewClient();

    const pendingMigrations = await migrationRunner({
      ...migrationsConfig,
      dbClient: client,
    });

    return pendingMigrations;
  } catch (error) {
    const serviceErrorObject = new ServiceError({
      message: "Serviço de migração indisponível.",
      cause: error,
    });

    console.error(serviceErrorObject);
    throw serviceErrorObject;
  } finally {
    client?.end();
  }
}

const migrator = {
  runPendingMigrations,
  listPendingMigrations,
};

export default migrator;
