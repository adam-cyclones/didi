export class UnpackCompilerPanic extends Error {
  constructor(message) {
    super(message);
    this.name = "UnpackCompilerPanic"; // (2)
  }
}