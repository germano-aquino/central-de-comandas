import controller from "infra/controller";
import store from "models/store";

import { createRouter } from "next-connect";

const router = createRouter();

export default router.handler(controller.errorHandlers);

router.use(controller.injectAnonymousOrUser);
router.post(controller.canRequest("create:store"), postHandler);
router.get(controller.canRequest("read:store"), getHandler);
router.delete(controller.canRequest("delete:store"), deleteHandler);

async function postHandler(request, response) {
  const storeInputValues = await request.body;
  const newCategory = await store.create(storeInputValues);

  return response.status(201).json(newCategory);
}

async function getHandler(request, response) {
  const storedStores = await store.retrieveAll();

  return response.status(200).json(storedStores);
}

async function deleteHandler(request, response) {
  const storesInputValues = await request.body;

  const deletedStores = await store.deleteManyByIdArray(
    storesInputValues.store_ids,
  );

  return response.status(200).json(deletedStores);
}
