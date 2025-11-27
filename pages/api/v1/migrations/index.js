import database from "infra/database.js";

import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";

async function migrations(request, response) {
  if (!["GET", "POST"].includes(request.method)) {
    return response.status(405).json({});
  }

  const client = await database.getNewClient();
  const migrationsConfig = {
    dbClient: client,
    dryRun: true,
    dir: resolve("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  if (request.method === "GET") {
    const pendingMigrations = await migrationRunner(migrationsConfig);

    client.end();
    return response.status(200).json(pendingMigrations);
  }

  if (request.method === "POST") {
    const migratedMigrations = await migrationRunner({
      ...migrationsConfig,
      dryRun: false,
    });

    client.end();

    if (migratedMigrations.length) {
      return response.status(201).json(migratedMigrations);
    }

    return response.status(200).json(migratedMigrations);
  }
}

export default migrations;
