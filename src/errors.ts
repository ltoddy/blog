export class ValidateError extends Error {
  constructor(message: string) {
    super();
    this.message = message;
  }
}
