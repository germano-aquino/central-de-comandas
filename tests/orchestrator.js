import { faker } from "@faker-js/faker";
import retry from "async-retry";
import database from "infra/database";
import activation from "models/activation";
import migrator from "models/migrator";
import question from "models/question";
import section from "models/section";
import service from "models/service";
import session from "models/session";
import user from "models/user";
import store from "models/store";
import customer from "models/customer";

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

async function createLoggedUser(userInputValues) {
  const inactiveUser = await createUser(userInputValues);
  const activatedUser = await activateUser(inactiveUser);
  const session = await createSession(activatedUser);
  return {
    ...activatedUser,
    token: session.token,
  };
}

async function createServices(length = 5, serviceDefaultValues = {}) {
  let services = [];

  for (let i = 0; i < length; i++) {
    const newService = await createService(
      serviceDefaultValues?.name,
      serviceDefaultValues?.price,
      serviceDefaultValues?.categoryId,
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

async function createQuestions(length = 5, questionDefaultValues = {}) {
  let questions = [];

  for (let i = 0; i < length; i++) {
    const newQuestion = await createQuestion(
      undefined,
      questionDefaultValues?.type,
      questionDefaultValues?.options,
      questionDefaultValues?.sectionId,
      questionDefaultValues?.optionMarked,
    );
    questions.push(newQuestion);
  }
  return questions;
}

async function createQuestion(
  statement,
  type,
  options,
  sectionId,
  optionMarked,
) {
  const questionInputValues = {
    statement: statement || faker.lorem.sentence({ min: 3, max: 10 }),
    type: type || "multiple-choice",
    options: options || ["Sim", "Não"],
    section_id: sectionId || null,
    option_marked: optionMarked || null,
  };

  return await question.create(questionInputValues);
}

async function createStores(length = 5, storesName = []) {
  let stores = [];

  if (storesName.length !== 0) {
    for (const name of storesName) {
      const storeObject = await createStore(name);
      stores.push(storeObject);
    }
  } else {
    for (let i = 0; i < length; i++) {
      const storeObject = await createStore(undefined);
      stores.push(storeObject);
    }
  }

  return stores;
}

async function createStore(sectionName) {
  const storeInputValues = {
    name: sectionName || faker.internet.username().replace(/[.-]/g, ""),
  };
  return await store.create(storeInputValues);
}

async function createCustomer(name, phone) {
  const customerInputValues = {
    name: name || faker.internet.username().replace(/[.-]/g, ""),
    phone: phone || faker.phone.number({ style: "international" }),
  };
  return await customer.create(customerInputValues);
}

async function createCustomers(length = 5, customersName = []) {
  let customers = [];

  if (customersName.length !== 0) {
    for (const name of customersName) {
      const customerObject = await createCustomer(name);
      customers.push(customerObject);
    }
  } else {
    for (let i = 0; i < length; i++) {
      const customerObject = await createCustomer(undefined);
      customers.push(customerObject);
    }
  }

  return customers;
}

async function addFeatures(unallowedUser, addFeaturesFunction) {
  const allowedUser = await addFeaturesFunction(unallowedUser);
  return allowedUser;
}

const orchestrator = {
  waitForAllServices,
  clearDatabase,
  runPendingMigrations,
  deleteAllEmails,
  getLastEmail,
  createUser,
  createLoggedUser,
  activateUser,
  createSession,
  createService,
  createServices,
  createQuestion,
  createQuestions,
  createSections,
  createSection,
  createStore,
  createStores,
  createCustomer,
  createCustomers,
  addFeatures,
};

export default orchestrator;
