import controller from "@/infra/controller";
import customer from "@/models/customer";
import { createRouter } from "next-connect";

const router = createRouter();

export default router.handler(controller.errorHandlers);

router.use(controller.injectAnonymousOrUser);
router.post(controller.canRequest("create:customer"), postHandler);
router.get(controller.canRequest("read:customer"), getHandler);

async function postHandler(request, response) {
  const customerInputValues = await request.body;

  const newCustomer = await customer.create(customerInputValues);

  return response.status(201).json(newCustomer);
}

async function getHandler(request, response) {
  const name = request.query.name;
  const phone = request.query.phone;

  const customers = await customer.retrieveAll(name, phone);

  return response.status(200).json(customers);
}
