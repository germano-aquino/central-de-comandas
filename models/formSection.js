import user from "./user";
import section from "./section";

async function create(formSectionInputValues) {
  const newFormSection = await section.create(formSectionInputValues, "form");
  return newFormSection;
}

async function update(formSectionName, formSectionInputValues) {
  const updatedFormSection = await section.update(
    formSectionName,
    formSectionInputValues,
    "form",
  );
  return updatedFormSection;
}

async function deleteManyByIdArray(formSectionIds) {
  const deletedFormSection = await section.deleteManyByIdArray(
    formSectionIds,
    "form",
  );
  return deletedFormSection;
}

async function deleteByName(formSectionName) {
  const deletedCategory = await section.deleteByName(formSectionName, "form");
  return deletedCategory;
}

async function findOneValidByName(formSectionName) {
  const validFormSection = await section.findOneValidByName(
    formSectionName,
    "form",
  );
  return validFormSection;
}

async function findOneValidById(formSectionId) {
  const validFormSection = await section.findOneValidById(
    formSectionId,
    "form",
  );
  return validFormSection;
}

async function retrieveAll() {
  const storedFormSections = await section.retrieveAll("form");
  return storedFormSections;
}

async function addFeatures(forbiddenUser) {
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
  addFeatures,
};

export default formSection;
