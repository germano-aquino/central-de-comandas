import controller from "infra/controller";
import service from "models/service";
import { createRouter } from "next-connect";

const router = createRouter();

export default router.handler(controller.errorHandlers);

router.use(controller.injectAnonymousOrUser);
router.post(controller.canRequest("create:service"), postHandler);
router.get(controller.canRequest("read:service"), getHandler);
router.patch(controller.canRequest("edit:service"), patchHandler);
router.delete(controller.canRequest("delete:service"), deleteHandler);

async function postHandler(request, response) {
  const serviceInputValues = await request.body;

  const createdService = await service.create(serviceInputValues);

  return response.status(201).json(createdService);
}

async function getHandler(request, response) {
  const categoryName = request.query?.category_name;

  const storedServices = await service.retrieveAll(categoryName);

  return response.status(200).json(storedServices);
}

async function patchHandler(request, response) {
  const serviceInputValues = await request.body;

  const updatedServices = await service.updateManyByIdArray(serviceInputValues);

  return response.status(200).json(updatedServices);
}

async function deleteHandler(request, response) {
  const serviceInputValues = await request.body;

  const deletedServices = await service.deleteManyByIdArray(
    serviceInputValues.service_ids,
  );

  return response.status(200).json(deletedServices);
}
