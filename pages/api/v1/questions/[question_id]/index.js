import controller from "infra/controller";
import question from "models/question";
import { createRouter } from "next-connect";

const router = createRouter();

export default router.handler(controller.errorHandlers);

router.use(controller.injectAnonymousOrUser);
router.patch(controller.canRequest("edit:question"), patchHandler);

async function patchHandler(request, response) {
  const questionInputValues = await request.body;
  const queryParams = request.query;

  const updatedQuestion = await question.update(
    questionInputValues,
    queryParams,
  );

  return response.status(200).json(updatedQuestion);
}
