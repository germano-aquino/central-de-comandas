import user from "./user";
import section from "./section";

async function create(categoryInputValues) {
  const newCategory = await section.create(categoryInputValues, "form");
  return newCategory;
}

async function update(categoryName, categoryInputValues) {
  const updatedCategory = await section.update(
    categoryName,
    categoryInputValues,
    "form",
  );
  return updatedCategory;
}

async function deleteManyByIdArray(categoryIds) {
  const deletedCategories = await section.deleteManyByIdArray(
    categoryIds,
    "form",
  );
  return deletedCategories;
}

async function deleteByName(categoryName) {
  const deletedCategory = await section.deleteByName(categoryName, "form");
  return deletedCategory;
}

async function findOneValidByName(categoryName) {
  const validCategory = await section.findOneValidByName(categoryName, "form");
  return validCategory;
}

async function findOneValidById(categoryId) {
  const validCategory = await section.findOneValidById(categoryId, "form");
  return validCategory;
}

async function retrieveAll() {
  const storedCategories = await section.retrieveAll("form");
  return storedCategories;
}

async function addFormSectionsFeatures(forbiddenUser) {
  const allowedUser = await user.addFeaturesByUserId(forbiddenUser.id, [
    "create:form_section",
    "read:form_section",
    "edit:form_section",
    "delete:form_section",
  ]);
  return allowedUser;
}

const formSection = {
  create,
  update,
  deleteByName,
  deleteManyByIdArray,
  findOneValidByName,
  findOneValidById,
  retrieveAll,
  addFormSectionsFeatures,
};

export default formSection;
