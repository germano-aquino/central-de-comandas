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
  console.log({
    host: process.env.POSTGRESS_HOST,
    port: process.env.POSTGRESS_PORT,
    user: process.env.POSTGRESS_USER,
    database: process.env.POSTGRESS_DB,
    password: process.env.POSTGRESS_PASSWORD,
  });

  const client = new Client({
    host: process.env.POSTGRESS_HOST,
    port: process.env.POSTGRESS_PORT,
    user: process.env.POSTGRESS_USER,
    database: process.env.POSTGRESS_DB,
    password: process.env.POSTGRESS_PASSWORD,
  });

  return client;
}

const database = { query };

export default database;
