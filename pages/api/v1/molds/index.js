import controller from "@/infra/controller";
import mold from "@/models/mold";

import { createRouter } from "next-connect";

const router = createRouter();

export default router.handler(controller.errorHandlers);

router.use(controller.injectAnonymousOrUser);
router.post(controller.canRequest("create:mold"), postHandler);
router.get(controller.canRequest("read:mold"), getHandler);
router.delete(controller.canRequest("delete:mold"), deleteHandler);

async function postHandler(request, response) {
  const moldInputValues = await request.body;

  const createdMold = await mold.create(moldInputValues);

  return response.status(201).json(createdMold);
}

async function getHandler(request, response) {
  const storedMolds = await mold.retrieveAll();
  return response.status(200).json(storedMolds);
}

async function deleteHandler(request, response) {
  const moldInputValues = await request.body;
  const deletedMolds = await mold.deleteManyByIdArray(moldInputValues);

  return response.status(200).json(deletedMolds);
}
