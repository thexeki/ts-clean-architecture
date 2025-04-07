export class MetaError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "UnauthenticatedError";
  }
}
