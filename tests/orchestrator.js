import { faker } from "@faker-js/faker";
import retry from "async-retry";
import database from "infra/database";
import activation from "models/activation";
import category from "models/category";
import formSection from "models/formSection";
import migrator from "models/migrator";
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

async function createCategories(length = 5, categoriesName = []) {
  let categories = [];

  if (categoriesName.length !== 0) {
    for (const name of categoriesName) {
      const category = await createCategory(name);
      categories.push(category);
    }
  } else {
    for (let i = 0; i < length; i++) {
      const category = await createCategory();
      categories.push(category);
    }
  }

  return categories;
}

async function createCategory(categoryName) {
  const categoryInputValues = {
    name: categoryName || faker.internet.username().replace(/[.-]/g, ""),
  };
  return await category.create(categoryInputValues);
}

async function addCategoriesFeatures(unallowedUser) {
  return await category.addCategoriesFeatures(unallowedUser);
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
  return await service.addServicesFeatures(unallowedUser);
}

async function createFormSections(length = 5, formSectionsName = []) {
  let formSections = [];

  if (formSectionsName.length !== 0) {
    for (const name of formSectionsName) {
      const formSectionObject = await createFormSection(name);
      formSections.push(formSectionObject);
    }
  } else {
    for (let i = 0; i < length; i++) {
      const formSectionObject = await createFormSection();
      formSections.push(formSectionObject);
    }
  }

  return formSections;
}

async function createFormSection(formSectionName) {
  const categoryInputValues = {
    name: formSectionName || faker.internet.username().replace(/[.-]/g, ""),
  };
  return await formSection.create(categoryInputValues);
}

async function addFormSectionsFeatures(unallowedUser) {
  return await formSection.addFormSectionsFeatures(unallowedUser);
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
  createCategory,
  createCategories,
  addCategoriesFeatures,
  createService,
  createServices,
  addServicesFeatures,
  createFormSection,
  createFormSections,
  addFormSectionsFeatures,
};

export default orchestrator;
