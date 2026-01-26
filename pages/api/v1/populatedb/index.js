import createCategories from "@/infra/scripts/populate-database";
import controller from "@/infra/controller";
import { createRouter } from "next-connect";

const router = createRouter();

export default router.handler(controller.errorHandlers);

router.post(postHandler);

async function postHandler(request, response) {
  await createCategories();
  return response.status(200).end();
}
