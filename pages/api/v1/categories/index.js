import controller from "infra/controller";
import category from "models/category";

import { createRouter } from "next-connect";

const router = createRouter();

export default router.handler(controller.errorHandlers);

router.use(controller.injectAnonymousOrUser);
router.post(controller.canRequest("create:category"), postHandler);

async function postHandler(request, response) {
  const categoryInputValues = await request.body;
  const newCategory = await category.create(categoryInputValues);

  return response.status(201).json(newCategory);
}
