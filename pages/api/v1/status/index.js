import database from "/infra/database.js";

async function status(request, response) {
  const updatedAt = new Date();

  const versionResult = await database.query("SHOW server_version;");
  const version = versionResult.rows[0].server_version;

  const maxConnectionsResult = await database.query("SHOW max_connections;");
  const maxConnections = Number(maxConnectionsResult.rows[0].max_connections);

  const openedConnectionsResult = await database.query(
    "SELECT * FROM pg_stat_activity WHERE state = 'active';"
  );
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

export default status;
