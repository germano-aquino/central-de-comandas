import controller from "infra/controller";
import question from "models/question";

import { createRouter } from "next-connect";

const router = createRouter();

export default router.handler(controller.errorHandlers);

router.use(controller.injectAnonymousOrUser);
router.post(controller.canRequest("create:question"), postHandler);
router.get(controller.canRequest("read:question"), getHandler);
router.patch(controller.canRequest("edit:question"), patchHandler);

async function postHandler(request, response) {
  const questionInputValues = await request.body;

  const questionCreated = await question.create(questionInputValues);

  return response.status(201).json(questionCreated);
}

async function getHandler(request, response) {
  const queryParams = await request.query;

  const storedQuestions = await question.retrieveAll(queryParams);

  return response.status(200).json(storedQuestions);
}

async function patchHandler(request, response) {
  const questionInputValues = await request.body;

  const updatedQuestions = await question.updateByArrayId(questionInputValues);

  return response.status(200).json(updatedQuestions);
}
