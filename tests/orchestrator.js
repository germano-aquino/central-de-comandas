import { faker } from "@faker-js/faker";
import retry from "async-retry";
import database from "infra/database";
import activation from "models/activation";
import category from "models/category";
import formSection from "models/formSection";
import migrator from "models/migrator";
import question from "models/question";
import section from "models/section";
import service from "models/service";
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

async function createServices(length = 5, serviceDefaultValues = {}) {
  let services = [];

  for (let i = 0; i < length; i++) {
    const newService = await createService(
      serviceDefaultValues?.name,
      serviceDefaultValues?.price,
      serviceDefaultValues?.category_id,
    );
    services.push(newService);
  }
  return services;
}

async function createService(serviceName, servicePrice, categoryId) {
  const serviceInputValues = {
    name: serviceName || faker.internet.username().replace(/[.-]/g, ""),
    price: servicePrice || faker.number.int({ min: 99, max: 9999 }),
    category_id: categoryId || null,
  };
  return await service.create(serviceInputValues);
}

async function addServicesFeatures(unallowedUser) {
  return await service.addFeatures(unallowedUser);
}

async function addCategoriesFeatures(unallowedUser) {
  return await category.addFeatures(unallowedUser);
}

async function addQuestionsFeatures(unallowedUser) {
  return await question.addFeatures(unallowedUser);
}

async function addFormSectionsFeatures(unallowedUser) {
  return await formSection.addFeatures(unallowedUser);
}

async function createSections(
  length = 5,
  sectionType = "service",
  sectionsName = [],
) {
  let sections = [];

  if (sectionsName.length !== 0) {
    for (const name of sectionsName) {
      const sectionObject = await createSection(name, sectionType);
      sections.push(sectionObject);
    }
  } else {
    for (let i = 0; i < length; i++) {
      const sectionObject = await createSection(undefined, sectionType);
      sections.push(sectionObject);
    }
  }

  return sections;
}

async function createSection(sectionName, sectionType = "service") {
  const sectionInputValues = {
    name: sectionName || faker.internet.username().replace(/[.-]/g, ""),
  };
  return await section.create(sectionInputValues, sectionType);
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
  createService,
  createServices,
  addServicesFeatures,
  addCategoriesFeatures,
  addQuestionsFeatures,
  addFormSectionsFeatures,
  createSections,
  createSection,
};

export default orchestrator;
