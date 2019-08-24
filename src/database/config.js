require('dotenv').config();

module.exports = {
  development: {
    username: process.env.USERNAME,
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
