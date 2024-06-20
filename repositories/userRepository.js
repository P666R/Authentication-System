const Database = require('../models/user');

class UserRepository {
  constructor(db) {
    if (!UserRepository.instance) {
      this.db = db;
      UserRepository.instance = this;
    }
    return UserRepository.instance;
  }

  async createUser(username, email, password) {
    const sql =
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    const values = [username, email, password];
    return await this.db.query(sql, values);
  }

  async findUserByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const values = [email];
    return await this.db.query(sql, values);
  }

  async findUserById(id) {
    const sql = 'SELECT * FROM users WHERE id = ?';
    const values = [id];
    return await this.db.query(sql, values);
  }
}

const instance = new UserRepository(Database);
Object.freeze(instance);

module.exports = instance;
