import { UserFacingError } from './UserFacingError';

export class NotFoundError extends UserFacingError {
  constructor(message, options = {}) {
    super(404, 'error.ejs', message, options);
  }
}
