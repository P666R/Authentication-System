const asyncHandler = require('express-async-handler');
const AuthService = require('../services/authService');

class AuthController {
  constructor(authService) {
    if (!AuthController.instance) {
      this.authService = authService;
      this.register = this.register.bind(this);
      this.login = this.login.bind(this);
      this.profile = this.profile.bind(this);
      AuthController.instance = this;
    }
    return AuthController.instance;
  }

  register = asyncHandler(async (req, res, next) => {
    const { username, email, password } = req.body;
    await this.authService.register(username, email, password);
    res.status(201).json({
      status: 'success',
      message: 'User registered successfully. Please login.',
    });
  });

  login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const { token } = await this.authService.login(email, password);
    res.status(200).json({
      status: 'success',
      message: 'User logged in successfully.',
      token,
    });
  });

  profile = asyncHandler(async (req, res, next) => {
    const user = await this.authService.profile(req.user.id);
    res.status(200).json({
      status: 'success',
      user,
    });
  });
}

const instance = new AuthController(AuthService);
Object.freeze(instance);

module.exports = instance;
