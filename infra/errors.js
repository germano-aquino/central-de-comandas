export class InternalServerError extends Error {
  constructor({ message, cause }) {
    super(message || "Um erro interno não esperado aconteceu.", cause);
    this.name = "InternalServerError";
    this.action = "Entre em contato com o suporte.";
    this.statusCode = 500;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class MethodNotAllowedError extends Error {
  constructor({ message, cause }) {
    super(message || "Método não permitido para este endpoint.", cause);
    this.name = "MethodNotAllowedError";
    this.action = "Verifique se o método HTTP é válido para este endpoint.";
    this.statusCode = 405;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class ServiceError extends Error {
  constructor({ message, cause }) {
    super(message || "O serviço indisponível no momento.", cause);
    this.name = "ServiceError";
    this.action = "Verifique se o serviço está disponível.";
    this.statusCode = 503;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class ValidationError extends Error {
  constructor({ message, cause, action }) {
    super(message || "Um erro de validação ocorreu", cause);
    this.name = "ValidationError";
    this.action = action || "Ajuste os dados utilizados e tente novamente.";
    this.statusCode = 400;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}
