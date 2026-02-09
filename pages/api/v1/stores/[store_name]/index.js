import controller from "@/infra/controller";
import store from "@/models/store";
import { createRouter } from "next-connect";

const router = createRouter();

export default router.handler(controller.errorHandlers);

router.use(controller.injectAnonymousOrUser);
router.delete(controller.canRequest("delete:store"), deleteHandler);
router.patch(controller.canRequest("edit:store"), patchHandler);

async function deleteHandler(request, response) {
  const storeName = request.query.store_name;

  const deletedStore = await store.deleteOneByName(storeName);

  return response.status(200).json(deletedStore);
}

async function patchHandler(request, response) {
  const storeName = request.query.store_name;
  const storeInputValues = await request.body;

  const updatedStore = await store.update(storeInputValues, storeName);

  return response.status(200).json(updatedStore);
}
