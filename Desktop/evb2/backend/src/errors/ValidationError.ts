import { CustomError } from './CustomError.js';

export class ValidationError extends CustomError {
  statusCode = 400;

  constructor(public message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }

  serializeErrors() {
    return [{ message: this.message, field: this.field }];
  }
}
