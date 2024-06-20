const Database = require('../../models/user');
const UserRepository = require('../../repositories/userRepository');

jest.mock('../../models/user');

describe('UserRepository', () => {
  beforeEach(() => {
    Database.query.mockClear();
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const user = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedPassword',
      };
      Database.query.mockResolvedValue([user]);

      const result = await UserRepository.createUser(
        'testuser',
        'test@example.com',
        'hashedPassword'
      );

      expect(Database.query).toHaveBeenCalledWith(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        ['testuser', 'test@example.com', 'hashedPassword']
      );
      expect(result).toEqual([user]);
    });
  });

  describe('findUserByEmail', () => {
    it('should find a user by email successfully', async () => {
      const user = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedPassword',
      };
      Database.query.mockResolvedValue([user]);

      const result = await UserRepository.findUserByEmail('test@example.com');

      expect(Database.query).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE email = ?',
        ['test@example.com']
      );
      expect(result).toEqual([user]);
    });
  });

  describe('findUserById', () => {
    it('should find a user by id successfully', async () => {
      const user = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedPassword',
      };
      Database.query.mockResolvedValue([user]);

      const result = await UserRepository.findUserById(1);

      expect(Database.query).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE id = ?',
        [1]
      );
      expect(result).toEqual([user]);
    });
  });
});
