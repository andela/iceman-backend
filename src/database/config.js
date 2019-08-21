require('dotenv').config();

module.exports = {
  development: {
    // username: process.env.USERNAME,
    // password: process.env.PASSWORD,
    // database: process.env.DB_NAME,
    // host: process.env.HOST,
    url: 'postgres://cbumltgb:EdF0peNKRoImUUNlMnu1q5ZOFgW4dDrR@isilo.db.elephantsql.com:5432/cbumltgb',
    dialect: 'postgres'
  },
  test: {
    quoteIdentifiers: false,
    use_env_variable: 'DATABASE_URL_TEST'
  },
  production: {
    use_env_variable: 'DATABASE_URL'
  }
};
