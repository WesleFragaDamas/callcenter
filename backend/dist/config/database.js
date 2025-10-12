"use strict";

require('dotenv').config();
var _require = require('pg'),
  Pool = _require.Pool;
var pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT
});
module.exports = {
  query: function query(text, params) {
    return pool.query(text, params);
  }
};