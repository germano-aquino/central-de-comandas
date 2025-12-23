import controller from "infra/controller";
import service from "models/service";
import { createRouter } from "next-connect";

const router = createRouter();

export default router.handler(controller.errorHandlers);

router.use(controller.injectAnonymousOrUser);
router.post(controller.canRequest("create:service"), postHandler);

async function postHandler(request, response) {
  const serviceInputValues = await request.body;

  const createdService = await service.create(serviceInputValues);

  return response.status(201).json(createdService);
}
