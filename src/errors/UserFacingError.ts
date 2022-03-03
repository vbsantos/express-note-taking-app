import { ApplicationError } from './ApplicationError';

export class UserFacingError extends ApplicationError {
  public view;

  constructor(statusCode, view, message, options = {}) {
    super(statusCode, message, options);
    this.view = view;
  }
}
