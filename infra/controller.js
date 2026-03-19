import session from "models/session";
import {
  InternalServerError,
  MethodNotAllowedError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
} from "./errors";
import user from "models/user";
import authorization from "models/authorization";
import cookie from "./cookie";

function onErrorHandler(error, request, response) {
  if (
    error instanceof ValidationError ||
    error instanceof NotFoundError ||
    error instanceof ForbiddenError
  ) {
    return response.status(error.statusCode).json(error);
  }

  if (error instanceof UnauthorizedError) {
    clearSessionCookie(response);
    return response.status(error.statusCode).json(error);
  }

  console.error(error);
  const publicErrorObject = new InternalServerError({ cause: error });
  return response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

function onNoMatchHandler(request, response) {
  const publicErrorObject = new MethodNotAllowedError({});
  return response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

function setStoreCookie(storeId, response) {
  const setCookie = cookie.set("store_id", storeId, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 Year,
    httpOnly: false,
    secure: false,
  });

  response.setHeader("Set-Cookie", setCookie);
}

function setSessionCookie(sessionToken, response) {
  const setCookie = cookie.set("session_id", sessionToken);

  response.setHeader("Set-Cookie", setCookie);
}

function clearSessionCookie(response) {
  const setCookie = cookie.clear("session_id");

  response.setHeader("Set-Cookie", setCookie);
}

function clearCacheControl(response) {
  response.setHeader(
    "Cache-Control",
    "no-store, no-cache, max-age=0, must-revalidate",
  );
}

async function injectAnonymousOrUser(request, response, next) {
  const isUserLogged = "session_id" in request.cookies;

  if (isUserLogged) {
    await inejectUserObject(request);
  } else {
    injectAnonymousUserObject(request);
  }

  return next();
}

function injectAnonymousUserObject(request) {
  const anonymousUserObject = {
    features: ["read:activation_token", "create:user", "create:session"],
  };

  request.context = {
    ...request.context,
    user: anonymousUserObject,
  };
}

async function inejectUserObject(request) {
  const sessionToken = request.cookies.session_id;
  const sessionObject = await session.findOneValidByToken(sessionToken);
  const loggedUser = await user.findOneById(sessionObject.user_id);

  request.context = {
    ...request.context,
    user: loggedUser,
  };
}

function canRequest(feature) {
  return function canRequestMiddleware(request, response, next) {
    const userTryingToRequest = request.context.user;

    if (authorization.can(userTryingToRequest, feature)) {
      return next();
    }

    throw new ForbiddenError({
      message: "O usuário não possui permissão para executar esta ação.",
      action: `Verifique se o usuário possui a feature "${feature}".`,
    });
  };
}

const controller = {
  errorHandlers: {
    onError: onErrorHandler,
    onNoMatch: onNoMatchHandler,
  },
  setSessionCookie,
  setStoreCookie,
  clearSessionCookie,
  clearCacheControl,
  injectAnonymousOrUser,
  canRequest,
};

export default controller;
