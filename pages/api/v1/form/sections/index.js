import controller from "infra/controller";
import { createRouter } from "next-connect";

const router = createRouter();

export default router.handler(controller.errorHandlers);

router.use(controller.injectAnonymousOrUser);
router.post(controller.canRequest("create:form_section"), postHandler);

async function postHandler(request, response) {
  const formSectionInputValues = await request.body;

  const createdSection = await formSectionInputValues.create(
    formSectionInputValues,
  );
  return createdSection;
}
