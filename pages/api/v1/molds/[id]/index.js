import controller from "@/infra/controller";
import mold from "@/models/mold";
import { createRouter } from "next-connect";

const router = createRouter();

export default router.handler(controller.errorHandlers);

router.use(controller.injectAnonymousOrUser);
router.get(controller.canRequest("read:mold"), getHandler);
router.patch(controller.canRequest("edit:mold"), patchHandler);

async function getHandler(request, response) {
  const moldId = request.query.id;
  const storedMold = await mold.findOneValidById(moldId);

  return response.status(200).json(storedMold);
}

async function patchHandler(request, response) {
  const moldInputValues = await request.body;
  const moldIdToBeUpdated = request.query.id;

  const updatedMold = await mold.update(moldIdToBeUpdated, moldInputValues);
  return response.status(200).json(updatedMold);
}
