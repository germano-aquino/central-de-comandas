import controller from "infra/controller";
import user from "models/user";
import { createRouter } from "next-connect";

const router = createRouter();

export default router.handler(controller.errorHandlers);

router.get(getHandler).patch(patchHandler);

async function getHandler(request, response) {
  const username = request.query.username;

  const userObject = await user.findOneByUsername(username);

  return response.status(200).json(userObject);
}

async function patchHandler(request, response) {
  const username = request.query.username;
  const userInputValues = request.body;

  const updatedUser = await user.update(username, userInputValues);

  return response.status(200).json(updatedUser);
}
