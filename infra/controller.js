import * as cookie from "cookie";

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

function setSessionCookie(sessionToken, response) {
  const setCookie = cookie.serialize("session_id", sessionToken, {
    // Garante que o cookie seja acessível a todas as rotas a partir do path
    path: "/",
    // Tempo máximo para ser expirado em segundos
    maxAge: session.EXPIRATION_IN_MILLISECONDS / 1000,
    // Só aceita cookie se estiver utilizando https
    secure: process.env.NODE_ENV === "production",
    // Restringe a camada de acesso do cookie impedindo leitura pelo console no client side
    httpOnly: true,
  });

  response.setHeader("Set-Cookie", setCookie);
}

function clearSessionCookie(response) {
  const setCookie = cookie.serialize("session_id", "invalid", {
    path: "/",
    maxAge: -1,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });

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

    if (userTryingToRequest.features.includes(feature)) {
      return next();
    }

    throw new ForbiddenError({
      message: "Você não possui permissão para executer esta ação.",
      action: `Verifique se seu usuário possui a feature "${feature}".`,
    });
  };
}

const controller = {
  errorHandlers: {
    onError: onErrorHandler,
    onNoMatch: onNoMatchHandler,
  },
  setSessionCookie,
  clearSessionCookie,
  clearCacheControl,
  injectAnonymousOrUser,
  canRequest,
};

export default controller;
