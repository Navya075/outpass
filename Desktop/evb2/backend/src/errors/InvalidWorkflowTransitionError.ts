import { CustomError } from './CustomError.js';

export class InvalidWorkflowTransitionError extends CustomError {
  statusCode = 409;

  constructor(public message: string) {
    super(message);
    this.name = 'InvalidWorkflowTransitionError';
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
