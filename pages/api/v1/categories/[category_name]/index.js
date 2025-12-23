import controller from "infra/controller";
import category from "models/category";

import { createRouter } from "next-connect";

const router = createRouter();

export default router.handler(controller.errorHandlers);

router.use(controller.injectAnonymousOrUser);
router.patch(controller.canRequest("edit:category"), patchHandler);
router.delete(controller.canRequest("delete:category"), deleteHandler);

async function patchHandler(request, response) {
  const categoryName = request.query.category_name;
  const categoryInputValues = await request.body;

  const newCategory = await category.update(categoryName, categoryInputValues);

  return response.status(200).json(newCategory);
}

async function deleteHandler(request, response) {
  const categoryName = request.query.category_name;

  const deletedCategory = await category.deleteByName(categoryName);

  return response.status(200).json(deletedCategory);
}
