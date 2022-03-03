import { UserFacingError } from './UserFacingError';

export class UnauthorizedError extends UserFacingError {
  constructor(message, options = {}) {
    super(401, 'error.ejs', message, options);
  }
}
