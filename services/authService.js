const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const AppError = require('../utils/appError');
const { jwtSecret } = require('../config/config');
const UserRepository = require('../repositories/userRepository');

class AuthService {
  constructor(userRepository) {
    if (!AuthService.instance) {
      this.userRepository = userRepository;
      AuthService.instance = this;
    }
    return AuthService.instance;
  }

  async register(username, email, password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await this.userRepository.createUser(
      username,
      email,
      hashedPassword
    );
    return user;
  }

  async login(email, password) {
    const [user] = await this.userRepository.findUserByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new AppError('Invalid credentials', 400);
    }

    const token = jwt.sign({ userId: user.id }, jwtSecret, {
      expiresIn: '1d',
    });

    return { token };
  }

  async profile(userId) {
    const [user] = await this.userRepository.findUserById(userId);
    if (user) {
      return { username: user.username, email: user.email };
    }
    throw new Error('User not found');
  }
}

const instance = new AuthService(UserRepository);
Object.freeze(instance);

module.exports = instance;
