const express = require('express');

const AuthController = require('../controllers/authController');
const AuthMiddleware = require('../middlewares/authMiddleware');

const {
  registerValidations,
  loginValidations,
  profileValidations,
  validateRequest,
} = require('../utils/validations');

const router = express.Router();

router.post(
  '/register',
  registerValidations(),
  validateRequest,
  AuthController.register
);

router.post(
  '/login',
  loginValidations(),
  validateRequest,
  AuthController.login
);

router.get(
  '/profile',
  profileValidations(),
  validateRequest,
  AuthMiddleware.authenticateToken,
  AuthController.profile
);

module.exports = router;
