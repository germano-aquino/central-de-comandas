import controller from "infra/controller";
import service from "models/service";
import { createRouter } from "next-connect";

const router = createRouter();

export default router.handler(controller.errorHandlers);

router.use(controller.injectAnonymousOrUser);
router.post(controller.canRequest("create:service"), postHandler);
router.get(controller.canRequest("read:service"), getHandler);

async function postHandler(request, response) {
  const serviceInputValues = await request.body;

  const createdService = await service.create(serviceInputValues);

  return response.status(201).json(createdService);
}

async function getHandler(request, response) {
  const storedServices = await service.retrieveAll();

  return response.status(200).json(storedServices);
}
