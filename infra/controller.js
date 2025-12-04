import * as cookie from "cookie";

import session from "models/session";
import {
  InternalServerError,
  MethodNotAllowedError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
} from "./errors";

function onErrorHandler(error, request, response) {
  if (
    error instanceof MethodNotAllowedError ||
    error instanceof ValidationError ||
    error instanceof NotFoundError
  ) {
    return response.status(error.statusCode).json(error);
  }

  if (error instanceof UnauthorizedError) {
    error.message = "O email ou a senha estão incorretos.";
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

const controller = {
  errorHandlers: {
    onError: onErrorHandler,
    onNoMatch: onNoMatchHandler,
  },
  setSessionCookie,
};

export default controller;
