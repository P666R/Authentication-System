const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AuthService = require('../../services/authService');
const UserRepository = require('../../repositories/userRepository');
const AppError = require('../../utils/appError');
const { jwtSecret } = require('../../config/config');

jest.mock('../../repositories/userRepository');

describe('AuthService', () => {
  beforeEach(() => {
    UserRepository.createUser.mockClear();
    UserRepository.findUserByEmail.mockClear();
    UserRepository.findUserById.mockClear();
  });

  describe('register', () => {
    it('should register a user successfully', async () => {
      const user = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedPassword',
      };
      UserRepository.createUser.mockResolvedValue(user);

      const result = await AuthService.register(
        'testuser',
        'test@example.com',
        'password'
      );

      expect(UserRepository.createUser).toHaveBeenCalledWith(
        'testuser',
        'test@example.com',
        expect.any(String)
      );
      expect(result).toEqual(user);
    });
  });

  describe('login', () => {
    it('should login a user successfully and return a token', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        password: await bcrypt.hash('password', 10),
      };
      UserRepository.findUserByEmail.mockResolvedValue([user]);

      const result = await AuthService.login('test@example.com', 'password');

      expect(UserRepository.findUserByEmail).toHaveBeenCalledWith(
        'test@example.com'
      );
      expect(result).toHaveProperty('token');
      const decoded = jwt.verify(result.token, jwtSecret);
      expect(decoded).toHaveProperty('userId', user.id);
    });

    it('should throw an error if credentials are invalid', async () => {
      UserRepository.findUserByEmail.mockResolvedValue([null]);

      await expect(
        AuthService.login('test@example.com', 'password')
      ).rejects.toThrow(AppError);
    });
  });

  describe('profile', () => {
    it('should return user profile', async () => {
      const user = { id: 1, username: 'testuser', email: 'test@example.com' };
      UserRepository.findUserById.mockResolvedValue([user]);

      const result = await AuthService.profile(user.id);

      expect(UserRepository.findUserById).toHaveBeenCalledWith(user.id);
      expect(result).toEqual({
        username: 'testuser',
        email: 'test@example.com',
      });
    });

    it('should throw an error if user is not found', async () => {
      UserRepository.findUserById.mockResolvedValue([null]);

      await expect(AuthService.profile(1)).rejects.toThrow('User not found');
    });
  });
});
