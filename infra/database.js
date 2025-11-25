import { Client } from "pg";

async function query(queryObject) {
  let client;

  try {
    client = getNewClient();
    await client.connect();
    const result = await client.query(queryObject);

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    client?.end();
  }
}

function getNewClient() {
  const client = new Client({
    host: "localhost",
    port: 5432,
    user: "postgres",
    database: "postgres",
    password: "local_password",
  });

  return client;
}

const database = { query };

export default database;
