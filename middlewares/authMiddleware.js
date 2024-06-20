const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const asyncHandler = require('express-async-handler');

const AppError = require('../utils/appError');
const { jwtSecret } = require('../config/config');
const UserRepository = require('../repositories/userRepository');

class AuthMiddleware {
  static authenticateToken = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('No token provided', 401));
    }

    const jwtToken = authHeader.split(' ')[1];

    const decoded = await promisify(jwt.verify)(jwtToken, jwtSecret);

    if (!decoded) {
      return next(new AppError('Invalid token', 403));
    }

    const { userId } = decoded;

    const [user] = await UserRepository.findUserById(userId);

    if (!user) {
      return next(new AppError('User not found for this token', 404));
    }

    req.user = user;
    next();
  });
}

module.exports = AuthMiddleware;
