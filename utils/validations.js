const { body, header, validationResult } = require('express-validator');
const AppError = require('../utils/appError');

const usernameSchema = body('username')
  .isString()
  .notEmpty()
  .withMessage('Username is required')
  .matches(/^[a-zA-Z0-9_-]+$/)
  .withMessage(
    'Username may contain alphanumeric characters, underscores, or hyphens'
  );

const emailSchema = body('email').isEmail().withMessage('Email must be valid');

const passwordSchema = body('password')
  .isString()
  .isLength({ min: 6 })
  .withMessage('Password must be at least 6 characters long')
  .matches(/[a-z]/)
  .withMessage('Password must contain at least one lowercase letter')
  .matches(/[A-Z]/)
  .withMessage('Password must contain at least one uppercase letter')
  .matches(/[0-9]/)
  .withMessage('Password must contain at least one number')
  .matches(/[!@#$%^&*(),.?":{}|<>]/)
  .withMessage('Password must contain at least one special character');

const authHeaderSchema = [
  header('Authorization')
    .notEmpty()
    .withMessage('Authorization header is required')
    .matches(/^Bearer\s[^\s]+$/)
    .withMessage('Authorization header must contain a valid JWT token'),
  header('authorization')
    .notEmpty()
    .withMessage('Authorization header is required')
    .matches(/^Bearer\s[^\s]+$/)
    .withMessage('Authorization header must contain a valid JWT token'),
];

const registerValidations = () => [usernameSchema, emailSchema, passwordSchema];

const loginValidations = () => [emailSchema, passwordSchema];

const profileValidations = () => [authHeaderSchema];

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError(
      `Validation failed: ${errors
        .array()
        .map((e) => e.msg)
        .join(', ')}`,
      400
    );
  }

  next();
};

module.exports = {
  registerValidations,
  loginValidations,
  profileValidations,
  validateRequest,
};
