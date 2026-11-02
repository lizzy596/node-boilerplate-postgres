const { Pool } = require('pg');
const config = require('./config');

const db = new Pool(config.postgres);
db.on('connect', () => {
  console.log('Connected to the PostgreSQL database!');
});

module.exports = db;
