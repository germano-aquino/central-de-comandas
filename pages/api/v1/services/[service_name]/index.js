import controller from "infra/controller";
import service from "models/service";

import { createRouter } from "next-connect";

const router = createRouter();

export default router.handler(controller.errorHandlers);

router.use(controller.injectAnonymousOrUser);
router.get(controller.canRequest("read:service"), getHandler);
router.patch(controller.canRequest("edit:service"), patchHandler);
router.delete(controller.canRequest("delete:service"), deleteHandler);

async function getHandler(request, response) {
  const serviceName = request.query.service_name;

  const storedService = await service.findOneValidByName(serviceName);

  return response.status(200).json(storedService);
}

async function patchHandler(request, response) {
  const serviceName = request.query.service_name;
  const serviceInputValues = await request.body;

  const updatedService = await service.update(serviceName, serviceInputValues);
  return response.status(200).json(updatedService);
}

async function deleteHandler(request, response) {
  const serviceName = request.query.service_name;

  const deletedService = await service.deleteOneByName(serviceName);

  return response.status(200).json(deletedService);
}
