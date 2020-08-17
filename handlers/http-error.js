class HttpError extends Error {
  constructor(message, errorCode) {
    super(message);
    this.message = message;
    this.status = errorCode;
  }
}

module.exports = HttpError;
