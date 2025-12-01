import database from "/infra/database.js";
import { createRouter } from "next-connect";
import controller from "infra/controller";

const router = createRouter();

router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const updatedAt = new Date().toISOString();

  const versionResult = await database.query("SHOW server_version;");
  const version = versionResult.rows[0].server_version;

  const maxConnectionsResult = await database.query("SHOW max_connections;");
  const maxConnections = Number(maxConnectionsResult.rows[0].max_connections);

  const databaseName = process.env.POSTGRES_DB;
  const openedConnectionsResult = await database.query({
    text: "SELECT * FROM pg_stat_activity WHERE state = 'active' AND datname = $1;",
    values: [databaseName],
  });
  const openedConnections = openedConnectionsResult.rowCount;

  const statusBody = {
    updated_at: updatedAt,
    dependencies: {
      database: {
        version,
        max_connections: maxConnections,
        opened_connections: openedConnections,
      },
    },
  };

  return response.status(200).json(statusBody);
}
