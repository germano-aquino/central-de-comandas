import controller from "@/infra/controller";
import mold from "@/models/mold";

import { createRouter } from "next-connect";

const router = createRouter();

export default router.handler(controller.errorHandlers);

router.use(controller.injectAnonymousOrUser);
router.post(controller.canRequest("create:mold"), postHandler);

async function postHandler(request, response) {
  const moldInputValues = await request.body;

  const createdMold = await mold.create(moldInputValues);

  return response.status(201).json(createdMold);
}
