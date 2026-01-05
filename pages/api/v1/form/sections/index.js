import controller from "infra/controller";
import formSection from "models/formSection";

import { createRouter } from "next-connect";

const router = createRouter();

export default router.handler(controller.errorHandlers);

router.use(controller.injectAnonymousOrUser);
router.post(controller.canRequest("create:form_section"), postHandler);
router.get(controller.canRequest("read:form_section"), getHandler);
router.delete(controller.canRequest("delete:form_section"), deleteHandler);

async function postHandler(request, response) {
  const formSectionInputValues = await request.body;

  const createdSection = await formSection.create(formSectionInputValues);
  return response.status(201).json(createdSection);
}

async function getHandler(request, response) {
  const storedFormSections = await formSection.retrieveAll();

  return response.status(200).json(storedFormSections);
}

async function deleteHandler(request, response) {
  const formeSectionInputValues = await request.body;

  const deletedCategories = await formSection.deleteManyByIdArray(
    formeSectionInputValues.form_section_ids,
  );

  return response.status(200).json(deletedCategories);
}
