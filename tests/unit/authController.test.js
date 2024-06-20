const express = require('express');
const request = require('supertest');
const AuthService = require('../../services/authService');
const AuthController = require('../../controllers/authController');

jest.mock('../../services/authService');

describe('AuthController', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());

    app.post('/register', AuthController.register);
    app.post('/login', AuthController.login);
    app.get(
      '/profile',
      (req, res, next) => {
        req.user = { id: 1 };
        next();
      },
      AuthController.profile
    );

    app.use((err, req, res, next) => {
      res.status(err.statusCode || 500).json({
        status: err.status || 'error',
        message: err.message || 'Internal Server Error',
      });
    });
  });

  describe('register', () => {
    it('should register a user successfully', async () => {
      AuthService.register.mockResolvedValue({
        username: 'testuser',
        email: 'test@example.com',
      });

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
    });

    it('should not register a user with an existing email', async () => {
      AuthService.register.mockImplementation(() => {
        throw new Error('Email already in use');
      });

      const response = await request(app).post('/register').send({
        username: 'testuser',
        email: 'test@example.com',
        password: '!Password123',
      });

      console.log('Error response body:', response.body);

      expect(response.status).toBe(500);
      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('Email already in use');
    });
  });

  describe('login', () => {
    it('should login a user successfully', async () => {
      AuthService.login.mockResolvedValue('jwtToken');

      const response = await request(app)
        .post('/login')
        .send({ email: 'test@example.com', password: '!Password123' });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('User logged in successfully.');
    });

    it('should not login a user with incorrect credentials', async () => {
      AuthService.login.mockImplementation(() => {
        throw new Error('Invalid credentials');
      });

      const response = await request(app)
        .post('/login')
        .send({ email: 'test@example.com', password: 'wrongPassword' });

      console.log('Error response body:', response.body);

      expect(response.status).toBe(500);
      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('Invalid credentials');
    });
  });

  describe('profile', () => {
    it('should return user profile', async () => {
      AuthService.profile.mockResolvedValue({
        username: 'testuser',
        email: 'test@example.com',
      });

      const response = await request(app).get('/profile').send();

      console.log('Profile response body:', response.body);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.user).toEqual({
        username: 'testuser',
        email: 'test@example.com',
      });
    });

    it('should return an error for an invalid token', async () => {
      AuthService.profile.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const response = await request(app)
        .get('/profile')
        .set('Authorization', 'Bearer invalidtoken')
        .send();

      console.log('Invalid token response body:', response.body);

      expect(response.status).toBe(500);
      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('Invalid token');
    });
  });
});
