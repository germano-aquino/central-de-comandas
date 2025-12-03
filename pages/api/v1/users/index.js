import controller from "infra/controller";
import user from "models/user.js";

import { createRouter } from "next-connect";

const router = createRouter();

export default router.handler(controller.errorHandlers);

router.post(postHandler);

async function postHandler(request, response) {
  const userInputValues = await request.body;

  const createdUser = await user.create(userInputValues);
  return response.status(201).json(createdUser);
}
