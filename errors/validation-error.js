// Из задания не понятно, надо ли самостоятельно описывать или обрабатывать ошибки, и как это делать
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

module.exports = ValidationError;
