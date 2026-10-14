export class BlobConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BlobConfigError";
  }
}
