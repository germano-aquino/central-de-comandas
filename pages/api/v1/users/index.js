import controller from "infra/controller";
import activation from "models/activation";
import user from "models/user.js";

import { createRouter } from "next-connect";

const router = createRouter();

export default router.handler(controller.errorHandlers);

router.use(controller.injectAnonymousOrUser);
router.post(controller.canRequest("create:user"), postHandler);

async function postHandler(request, response) {
  const userInputValues = await request.body;

  const createdUser = await user.create(userInputValues);
  const activationToken = await activation.create(createdUser);
  await activation.sendActivationEmail(createdUser, activationToken.id);

  return response.status(201).json(createdUser);
}
