export class DidiPermissibleError extends Error {
  constructor(message) {
    super(`permissible: ${message}`);
    this.name = "DidiPermissibleError"; // (2)
  }
}