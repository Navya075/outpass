import { CustomError } from './CustomError.js';

export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor(public message: string = 'Requested resource not found.') {
    super(message);
    this.name = 'NotFoundError';
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
