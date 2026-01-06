import controller from "infra/controller";
import category from "models/category";

import { createRouter } from "next-connect";

const router = createRouter();

export default router.handler(controller.errorHandlers);

router.use(controller.injectAnonymousOrUser);
router.post(controller.canRequest("create:category"), postHandler);
router.get(controller.canRequest("read:category"), getHandler);
router.delete(controller.canRequest("delete:category"), deleteHandler);

async function postHandler(request, response) {
  const categoryInputValues = await request.body;
  const newCategory = await category.create(categoryInputValues);

  return response.status(201).json(newCategory);
}

async function getHandler(request, response) {
  const storedCategories = await category.retrieveAll();

  return response.status(200).json(storedCategories);
}

async function deleteHandler(request, response) {
  const categoriesInputValues = await request.body;

  const deletedCategories = await category.deleteManyByIdArray(
    categoriesInputValues.category_ids,
  );

  return response.status(200).json(deletedCategories);
}
