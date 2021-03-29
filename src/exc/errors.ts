import * as status from "http-status";

/**
 * Generic Service Error
 */
class ServiceError extends Error {
  private status: number;
  private cause: Error;
  constructor(statusCode: number, message: string, cause?: Error) {
    super(message);
    this.status = statusCode;
    this.cause = cause;
  }
}

/**
 * DNA Validation Error
 */
class InvalidDNAError extends ServiceError {
  constructor(message: string) {
    super(status.BAD_REQUEST, message);
  }
}

/**
 * Non Mutant DNA Error
 */
class NoMutantError extends ServiceError {
  constructor(message: string) {
    super(status.FORBIDDEN, message);
  }
}

export { ServiceError, NoMutantError, InvalidDNAError };
