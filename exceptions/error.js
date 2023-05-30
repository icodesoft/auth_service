
class ApplicationError extends Error {
  constructor(message, statusCode, originError) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message || 'Something went wrong. Please try again.';
    this.statusCode = statusCode || 500;
    this.originError = originError;
  }
}

class NotFoundError extends ApplicationError {
  constructor(message, originError) {
    super(message || 'Not found.', 404, originError);
  }
}

class InvalidParameterError extends ApplicationError {
  constructor(message, originError) {
    super(message || 'Parameter validation failed, please check.', 400, originError);
  }
}

class ForbiddenError extends ApplicationError {
  constructor(message, originError) {
    super(message || 'User does not have permission to perform the operation.', 403, originError);
  }
}

class DatabaseError extends ApplicationError {
  constructor(message, originError) {
    super(message || 'An error occurred while performing a database operation.', 500, originError);
  }
}

class AuthError extends ApplicationError {
  constructor(message, originError) {
    super(message || 'Invalid token.', 401, originError);
  }
}

module.exports = {
  ApplicationError,
  InvalidParameterError,
  NotFoundError,
  DatabaseError,
  AuthError,
  ForbiddenError,
};