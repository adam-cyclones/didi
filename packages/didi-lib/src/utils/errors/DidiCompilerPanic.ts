export class DidiCompilerPanic extends Error {
  constructor(message) {
    super(message);
    this.name = "DidiCompilerPanic"; // (2)
  }
}