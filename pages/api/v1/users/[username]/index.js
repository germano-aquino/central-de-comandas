import controller from "infra/controller";
import user from "models/user";
import { createRouter } from "next-connect";

const router = createRouter();

export default router.handler(controller.errorHandlers);

router.get(getHandler);

async function getHandler(request, response) {
  const username = request.query.username;

  const userObject = await user.findOneByUsername(username);
  console.log(userObject);

  return response.status(200).json(userObject);
}
