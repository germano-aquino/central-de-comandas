import controller from "@/infra/controller";
import store from "@/models/store";
import { createRouter } from "next-connect";

const router = createRouter();

export default router.handler(controller.errorHandlers);

router.use(controller.injectAnonymousOrUser);
router.delete(controller.canRequest("delete:store"), deleteHandler);

async function deleteHandler(request, response) {
  const storeName = await request.query.store_name;
  console.log("store name:", storeName);

  const deletedStore = await store.deleteOneByName(storeName);

  return response.status(200).json(deletedStore);
}
