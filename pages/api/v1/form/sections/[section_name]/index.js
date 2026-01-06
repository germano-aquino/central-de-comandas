import controller from "infra/controller";
import formSection from "models/formSection";

import { createRouter } from "next-connect";

const router = createRouter();

export default router.handler(controller.errorHandlers);

router.use(controller.injectAnonymousOrUser);
router.patch(controller.canRequest("edit:form_section"), patchHandler);
router.delete(controller.canRequest("delete:form_section"), deleteHandler);

async function patchHandler(request, response) {
  const formSectionName = request.query.section_name;
  const formSectionInputValues = await request.body;

  const updatedFormSection = await formSection.update(
    formSectionName,
    formSectionInputValues,
  );

  return response.status(200).json(updatedFormSection);
}

async function deleteHandler(request, response) {
  const formSectionName = request.query.section_name;

  const deletedFormSection = await formSection.deleteByName(formSectionName);

  return response.status(200).json(deletedFormSection);
}
