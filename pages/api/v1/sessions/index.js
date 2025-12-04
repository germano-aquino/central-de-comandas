import session from "models/session";
import authentication from "models/authentication";
import controller from "infra/controller";

const { createRouter } = require("next-connect");

const router = createRouter();

router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(request, response) {
  const sessionInputValues = request.body;

  const authenticatedUser = await authentication.getAuthenticatedUser(
    sessionInputValues.email,
    sessionInputValues.password,
  );

  const sessionObject = await session.create(authenticatedUser.id);

  controller.setSessionCookie(sessionObject.token, response);

  return response.status(201).json(sessionObject);
}
