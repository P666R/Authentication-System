const AppError = require('../utils/appError');

const sendErrorDevelopment = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  console.error('ERROR:', err);
  res.status(err.statusCode).send('Something went wrong');
};

const sendErrorProduction = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    console.error('ERROR:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
    });
  }

  console.error('ERROR:', err);
  res.status(err.statusCode).send('Something went very wrong');
};

const notFound = (req, res, next) => {
  next(new AppError(`Not Found - ${req.originalUrl}`, 404));
};

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDevelopment(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    sendErrorProduction(err, req, res);
  }
};

module.exports = { errorHandler, notFound };
