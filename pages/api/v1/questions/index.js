import controller from "infra/controller";
import question from "models/question";

import { createRouter } from "next-connect";

const router = createRouter();

export default router.handler(controller.errorHandlers);

router.use(controller.injectAnonymousOrUser);
router.post(controller.canRequest("create:question"), postHandler);

async function postHandler(request, response) {
  const questionInputValues = await request.body;

  const questionCreated = await question.create(questionInputValues);

  return response.status(201).json(questionCreated);
}
