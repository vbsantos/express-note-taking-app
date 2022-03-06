import { UserFacingError } from './UserFacingError';

export class DatabaseError extends UserFacingError {
  constructor(message, options = {}) {
    super(500, 'error.ejs', message, options);
  }
}
