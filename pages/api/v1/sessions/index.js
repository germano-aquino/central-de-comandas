import session from "models/session";
import authentication from "models/authentication";
import controller from "infra/controller";
import authorization from "models/authorization";
import { ForbiddenError } from "infra/errors";

const { createRouter } = require("next-connect");

const router = createRouter();

router.use(controller.injectAnonymousOrUser);
router.post(controller.canRequest("create:session"), postHandler);
router.delete(deleteHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(request, response) {
  const sessionInputValues = request.body;

  const authenticatedUser = await authentication.getAuthenticatedUser(
    sessionInputValues.email,
    sessionInputValues.password,
  );

  if (!authorization.can(authenticatedUser, "create:session")) {
    throw new ForbiddenError({
      message: "O usuário não possui permissão para fazer login.",
      action: "Contate o suporte caso acredite que seja um erro.",
    });
  }

  const sessionObject = await session.create(authenticatedUser.id);

  controller.setSessionCookie(sessionObject.token, response);

  return response.status(201).json(sessionObject);
}

async function deleteHandler(request, response) {
  const sessionToken = request.cookies.session_id;

  const currentSession = await session.findOneValidByToken(sessionToken);
  const deletedSession = await session.expireById(currentSession.id);
  controller.clearSessionCookie(response);

  return response.status(200).json(deletedSession);
}
