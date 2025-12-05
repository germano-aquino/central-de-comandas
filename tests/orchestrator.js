import { faker } from "@faker-js/faker";
import retry from "async-retry";
import database from "infra/database";
import migrator from "models/migrator";
import session from "models/session";
import user from "models/user";

const emailHttpUrl = `http://${process.env.EMAIL_HTTP_HOST}:${process.env.EMAIL_HTTP_PORT}`;

async function waitForAllServices() {
  await waitForWebServer();
  await waitForEmailServer();

  async function waitForWebServer() {
    return retry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 1000,
    });

    async function fetchStatusPage() {
      const response = await fetch("http://localhost:3000/api/v1/status");

      if (response.status !== 200) {
        throw new Error();
      }
    }
  }

  async function waitForEmailServer() {
    return retry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 1000,
    });

    async function fetchStatusPage() {
      const response = await fetch(emailHttpUrl);

      if (response.status !== 200) {
        throw new Error();
      }
    }
  }
}

async function clearDatabase() {
  await database.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
}

async function runPendingMigrations() {
  await migrator.runPendingMigrations();
}

async function deleteAllEmails() {
  await fetch(`${emailHttpUrl}/messages`, {
    method: "DELETE",
  });
}

async function getLastEmail() {
  const response = await fetch(`${emailHttpUrl}/messages`);
  const emailList = await response.json();
  const lastEmailItem = emailList.pop();

  const lastEmailBody = await fetch(
    `${emailHttpUrl}/messages/${lastEmailItem.id}.plain`,
  );

  lastEmailItem.text = await lastEmailBody.text();
  return lastEmailItem;
}

async function createUser(userInputValues) {
  const userObject = {
    username:
      userInputValues?.username ||
      faker.internet.username().replace(/[.-]/g, ""),
    email: userInputValues?.email || faker.internet.email(),
    password: userInputValues?.password || "validPassword",
  };

  return await user.create(userObject);
}

async function createSession(unloggedUser) {
  return await session.create(unloggedUser.id);
}

const orchestrator = {
  waitForAllServices,
  clearDatabase,
  runPendingMigrations,
  deleteAllEmails,
  getLastEmail,
  createUser,
  createSession,
};

export default orchestrator;
