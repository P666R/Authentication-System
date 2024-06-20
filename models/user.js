const mysql = require('mysql2/promise');
const { db } = require('../config/config');

class Database {
  constructor() {
    this.pool = mysql.createPool({
      host: db.host,
      user: db.username,
      password: db.password,
      database: db.database,
      port: db.port,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  async query(sql, values) {
    const connection = await this.pool.getConnection();
    try {
      const [results] = await connection.query(sql, values);
      connection.release();
      return results;
    } catch (error) {
      connection.release();
      throw error;
    }
  }
}

module.exports = new Database();
