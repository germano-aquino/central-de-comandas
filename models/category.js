import user from "./user";
import section from "./section";

async function create(categoryInputValues) {
  const newCategory = await section.create(categoryInputValues, "service");
  return newCategory;
}

async function update(categoryName, categoryInputValues) {
  const updatedCategory = await section.update(
    categoryName,
    categoryInputValues,
    "service",
  );
  return updatedCategory;
}

async function deleteManyByIdArray(categoryIds) {
  const deletedCategories = await section.deleteManyByIdArray(
    categoryIds,
    "service",
  );
  return deletedCategories;
}

async function deleteByName(categoryName) {
  const deletedCategory = await section.deleteByName(categoryName, "service");
  return deletedCategory;
}

async function findOneValidByName(categoryName) {
  const validCategory = await section.findOneValidByName(
    categoryName,
    "service",
  );
  return validCategory;
}

async function findOneValidById(categoryId) {
  const validCategory = await section.findOneValidById(categoryId, "service");
  return validCategory;
}

async function retrieveAll() {
  const storedCategories = await section.retrieveAll("service");
  return storedCategories;
}

async function addFeatures(forbiddenUser) {
  const allowedUser = user.addFeaturesByUserId(forbiddenUser.id, [
    "create:category",
    "read:category",
    "edit:category",
    "delete:category",
  ]);
  return allowedUser;
}

const category = {
  create,
  update,
  deleteByName,
  deleteManyByIdArray,
  findOneValidByName,
  findOneValidById,
  retrieveAll,
  addFeatures,
};

export default category;
