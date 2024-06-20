const AppError = require('../../utils/appError');

describe('AppError', () => {
  it('should create an error with a message and status code', () => {
    const error = new AppError('Test error message', 400);

    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('Test error message');
    expect(error.statusCode).toBe(400);
    expect(error.status).toBe('fail');
    expect(error.isOperational).toBe(true);
  });

  it('should default status to "error" for status codes >= 500', () => {
    const error = new AppError('Test server error', 500);

    expect(error.status).toBe('error');
  });

  it('should capture the stack trace', () => {
    const error = new AppError('Stack trace error', 400);
    expect(error.stack).toBeDefined();
  });
});
