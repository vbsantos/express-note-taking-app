export class ApplicationError extends Error {
  public statusCode;

  constructor(statusCode, message, options = {}) {
    const formatedMessage = message.charAt(0).toUpperCase() + message.slice(1);
    super(formatedMessage);
    this.statusCode = statusCode;

    Object.keys(options).forEach((option) => {
      this[option] = options[option];
    });
  }

  get name() {
    return this.constructor.name;
  }
}
