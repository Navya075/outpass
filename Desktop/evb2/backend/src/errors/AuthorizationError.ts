import { CustomError } from './CustomError.js';

export class AuthorizationError extends CustomError {
  statusCode = 403;

  constructor(public message: string = 'You do not have permission to perform this action.') {
    super(message);
    this.name = 'AuthorizationError';
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
