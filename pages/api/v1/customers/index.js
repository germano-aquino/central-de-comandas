import controller from "@/infra/controller";
import customer from "@/models/customer";
import { createRouter } from "next-connect";

const router = createRouter();

export default router.handler(controller.errorHandlers);

router.use(controller.injectAnonymousOrUser);
router.post(controller.canRequest("create:customer"), postHandler);

async function postHandler(request, response) {
  const customerInputValues = await request.body;

  const newCustomer = await customer.create(customerInputValues);

  return response.status(201).json(newCustomer);
}
