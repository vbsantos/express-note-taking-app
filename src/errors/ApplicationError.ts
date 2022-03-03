export class ApplicationError extends Error {
  public statusCode;

  constructor(statusCode, message, options = {}) {
    super(message);
    this.statusCode = statusCode;

    Object.keys(options).forEach((option) => {
      this[option] = options[option];
    });
  }

  get name() {
    return this.constructor.name;
  }
}
