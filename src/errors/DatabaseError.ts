import { ApplicationError } from './ApplicationError';

export class DatabaseError extends ApplicationError {
  constructor(message, options = {}) {
    super(500, message, options);
  }
}
