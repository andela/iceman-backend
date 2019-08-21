require('dotenv').config();

const username = process.env.DBUSERNAME || process.env.USERNAME;
module.exports = {
  development: {
    username,
    password: process.env.PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.HOST,
    dialect: 'postgres',
    quoteIdentifiers: false
  },
  test: {
    quoteIdentifiers: false,
    use_env_variable: 'DATABASE_URL_TEST'
  },
  production: {
    use_env_variable: 'DATABASE_URL'
  }
};
