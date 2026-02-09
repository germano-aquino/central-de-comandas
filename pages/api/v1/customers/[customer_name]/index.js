import controller from "@/infra/controller";
import customer from "@/models/customer";
import { createRouter } from "next-connect";

const router = createRouter();

export default router.handler(controller.errorHandlers);

router.use(controller.injectAnonymousOrUser);
router.patch(controller.canRequest("edit:customer"), patchHandler);

async function patchHandler(request, response) {
  const customerName = request.query.customer_name;
  const customerInputValues = await request.body;

  const updatedCustomer = await customer.update(
    customerInputValues,
    customerName,
  );

  return response.status(200).json(updatedCustomer);
}
