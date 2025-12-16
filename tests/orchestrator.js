import { faker } from "@faker-js/faker";
import retry from "async-retry";
import database from "infra/database";
import activation from "models/activation";
import category from "models/category";
import migrator from "models/migrator";
import session from "models/session";
import user from "models/user";

const emailHttpUrl = `http://${process.env.EMAIL_HTTP_HOST}:${process.env.EMAIL_HTTP_PORT}`;
const webServerStatusPageUrl = "http://localhost:3000/api/v1/status";

async function waitForAllServices() {
  await waitForService(webServerStatusPageUrl);
  await waitForService(emailHttpUrl);

  async function waitForService(serviceUrl) {
    return retry(fetchStatusService, {
      retries: 100,
      maxTimeout: 1000,
    });

    async function fetchStatusService() {
      const response = await fetch(serviceUrl);

      if (response.status != 200) {
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

async function activateUser(inactiveUser) {
  return await activation.activateUserByUserId(inactiveUser.id);
}

async function createSession(unloggedUser) {
  return await session.create(unloggedUser.id);
}

async function setCategoriesFeatures(unallowedUser) {
  return await category.setCategoriesFeatures(unallowedUser);
}

const orchestrator = {
  waitForAllServices,
  clearDatabase,
  runPendingMigrations,
  deleteAllEmails,
  getLastEmail,
  createUser,
  activateUser,
  createSession,
  setCategoriesFeatures,
};

export default orchestrator;
