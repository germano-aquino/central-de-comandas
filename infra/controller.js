const { InternalServerError, MethodNotAllowedError } = require("./errors");

function onErrorHandler(error, request, response) {
  if (error instanceof MethodNotAllowedError) {
    return response.status(error.statusCode).json(error);
  }

  const publicErrorObject = new InternalServerError({ cause: error });
  return response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

function onNoMatchHandler(request, response) {
  const publicErrorObject = new MethodNotAllowedError({});
  return response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

const controller = {
  errorHandlers: {
    onError: onErrorHandler,
    onNoMatch: onNoMatchHandler,
  },
};

export default controller;
