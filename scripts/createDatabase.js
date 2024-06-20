const mysql = require('mysql2/promise');
const { db } = require('../config/config');

async function createDatabaseAndTables() {
  const connection = await mysql.createConnection({
    host: db.host,
    user: db.username,
    password: db.password,
    port: db.port,
  });

  // Create the database if it does not exist
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${db.database}\`;`);
  await connection.query(`USE \`${db.database}\`;`);

  // Create the users table if it does not exist
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await connection.query(createUsersTable);

  console.log('Database and tables created or verified successfully.');
  await connection.end();
}

createDatabaseAndTables().catch((err) => {
  console.error('Error creating database and tables:', err);
});
