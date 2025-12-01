import controller from "infra/controller";
import database from "infra/database.js";

import { createRouter } from "next-connect";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";

const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlers);

const migrationsConfig = {
  dryRun: true,
  dir: resolve("infra", "migrations"),
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
};

async function getHandler(request, response) {
  let client;

  try {
    client = await database.getNewClient();

    const pendingMigrations = await migrationRunner({
      ...migrationsConfig,
      dbClient: client,
    });
    return response.status(200).json(pendingMigrations);
  } finally {
    client?.end();
  }
}

async function postHandler(request, response) {
  let client;

  try {
    client = await database.getNewClient();

    const migratedMigrations = await migrationRunner({
      ...migrationsConfig,
      dbClient: client,
      dryRun: false,
    });

    if (migratedMigrations.length) {
      return response.status(201).json(migratedMigrations);
    }
    return response.status(200).json(migratedMigrations);
  } finally {
    client?.end();
  }
}
