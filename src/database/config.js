const { Pool } = require('pg');
const secret = require("../config").secret;

let pool;

if (process.env.NODE_ENV === "production") {
  pool = new Pool({
    connectionString: secret.SECRET
  });
}
else {
  pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT
  });
}

pool.connect();

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  }
}
