const { exec } = require('child_process');
const { db } = require('../config/config');

beforeAll((done) => {
  // Connect to the database and set up the schema
  const createDatabase = `
    CREATE DATABASE IF NOT EXISTS ${db.database};
    USE ${db.database};
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
    );
  `;
  exec(
    `mysql -u ${db.username} -p${db.password} -e "${createDatabase}"`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error creating database: ${stderr}`);
        done(error);
      } else {
        console.log('Database setup completed.');
        done();
      }
    }
  );
});

afterAll((done) => {
  // Clean up the database
  const dropDatabase = `DROP DATABASE ${db.database};`;
  exec(
    `mysql -u ${db.username} -p${db.password} -e "${dropDatabase}"`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error dropping database: ${stderr}`);
        done(error);
      } else {
        console.log('Database cleanup completed.');
        done();
      }
    }
  );
});
