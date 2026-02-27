import controller from "@/infra/controller";
import mold from "@/models/mold";
import { createRouter } from "next-connect";

const router = createRouter();

export default router.handler(controller.errorHandlers);

router.use(controller.injectAnonymousOrUser);
router.get(controller.canRequest("read:mold"), getHandler);

async function getHandler(request, response) {
  const moldId = request.query.id;
  const storedMold = await mold.findOneValidById(moldId);

  return response.status(200).json(storedMold);
}
