const { Pool } = require('pg');

const pool = new Pool({
  user: 'user',
  host: 'database-1',
  database: 'mydatabase',
  password: 'root',
  port: 5432,
});

module.exports = pool;