import { CustomError } from './CustomError.js';

export class AuthenticationError extends CustomError {
  statusCode = 401;

  constructor(public message: string = 'Authentication required.') {
    super(message);
    this.name = 'AuthenticationError';
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
