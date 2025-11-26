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
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
  });

  return client;
}

const database = { query };

export default database;
