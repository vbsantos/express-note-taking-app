import { UserFacingError } from './UserFacingError';

export class BadRequestError extends UserFacingError {
  constructor(message, options = {}) {
    super(400, 'error.ejs', message, options);
  }
}
