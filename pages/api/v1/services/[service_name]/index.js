import controller from "infra/controller";
import service from "models/service";

import { createRouter } from "next-connect";

const router = createRouter();

export default router.handler(controller.errorHandlers);

router.use(controller.injectAnonymousOrUser);
router.get(controller.canRequest("read:service"), getHandler);

async function getHandler(request, response) {
  const serviceName = request.query.service_name;

  const storedService = await service.findOneValidByName(serviceName);

  return response.status(200).json(storedService);
}
