import { CustomError } from './CustomError.js';

export class VersionConflictError extends CustomError {
  statusCode = 409;

  constructor(
    public documentId: string,
    public clientVersion: number,
    public serverVersion: number
  ) {
    super(
      `Conflict detected: Stale update rejected for document ${documentId}. Expected version ${clientVersion}, server is on version ${serverVersion}.`
    );
    this.name = 'VersionConflictError';
  }

  serializeErrors() {
    return [
      {
        message: this.message,
        documentId: this.documentId,
        clientVersion: this.clientVersion,
        serverVersion: this.serverVersion,
      },
    ];
  }
}
