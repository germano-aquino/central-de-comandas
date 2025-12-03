import session from "models/session";
import controller from "infra/controller";

const { createRouter } = require("next-connect");

const router = createRouter();

router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(request, response) {
  const sessionInputValues = request.body;

  const sessionObject = await session.create(sessionInputValues);
  return response.status(201).json(sessionObject);
}
