const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const Database = require('../../models/user');
const AuthController = require('../../controllers/authController');
const { jwtSecret } = require('../../config/config');

const app = express();
app.use(express.json());

app.post('/register', AuthController.register);
app.post('/login', AuthController.login);
app.get(
  '/profile',
  (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, jwtSecret);
    req.user = { id: decoded.userId };
    next();
  },
  AuthController.profile
);

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    message: err.message,
  });
});

describe('Authentication Integration Tests', () => {
  beforeAll(async () => {
    await Database.query('DELETE FROM users');
  });

  afterAll(async () => {
    await Database.pool.end();
  });

  describe('Register', () => {
    it('should register a user successfully', async () => {
      const response = await request(app).post('/register').send({
        username: 'testuser',
        email: 'test@example.com',
        password: '!Password123',
      });

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe(
        'User registered successfully. Please login.'
      );

      const users = await Database.query(
        'SELECT * FROM users WHERE email = ?',
        ['test@example.com']
      );
      expect(users.length).toBe(1);
      expect(users[0].username).toBe('testuser');
    });

    it('should not register a user with an existing email', async () => {
      await request(app).post('/register').send({
        username: 'anotheruser',
        email: 'test@example.com',
        password: '!Password123',
      });

      const response = await request(app).post('/register').send({
        username: 'testuser',
        email: 'test@example.com',
        password: '!Password123',
      });

      expect(response.status).toBe(500);
      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe(
        "Duplicate entry 'testuser' for key 'users.username'"
      );
    });
  });

  describe('Login', () => {
    it('should login a user successfully and return a token', async () => {
      const response = await request(app).post('/login').send({
        email: 'test@example.com',
        password: '!Password123',
      });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('User logged in successfully.');
      expect(response.body.token).toBeDefined();

      const decoded = jwt.verify(response.body.token, jwtSecret);
      expect(decoded).toHaveProperty('userId');
    });

    it('should not login a user with incorrect credentials', async () => {
      const response = await request(app).post('/login').send({
        email: 'test@example.com',
        password: 'wrongpassword',
      });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('fail');
      expect(response.body.message).toBe('Invalid credentials');
    });
  });

  describe('Profile', () => {
    let token;

    beforeAll(async () => {
      const response = await request(app).post('/login').send({
        email: 'test@example.com',
        password: '!Password123',
      });
      token = response.body.token;
    });

    it('should return the user profile for a valid token', async () => {
      const response = await request(app)
        .get('/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.user).toEqual({
        username: 'testuser',
        email: 'test@example.com',
      });
    });

    it('should return an error for an invalid token', async () => {
      const response = await request(app)
        .get('/profile')
        .set('Authorization', 'Bearer invalidtoken');

      expect(response.status).toBe(500);
      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('jwt malformed');
    });
  });
});
