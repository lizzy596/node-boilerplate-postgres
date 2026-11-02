const fs = require('fs');
const path = require('path');
const db = require('../config/db');

const runMigrations = async () => {
  try {
    console.log('Initializing database migrations...');

    const migrationsDir = path.join(__dirname, '../data/migrations');

    // Read all files from the migrations folder
    const files = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith('.sql'))
      .sort(); // Ensures 001 runs before 002, 002 before 003, etc.

    if (files.length === 0) {
      console.log('No migration files found.');
      process.exit(0);
    }

    // Execute each migration script sequentially
    for (const file of files) {
      const filePath = path.join(migrationsDir, file);
      const sqlQuery = fs.readFileSync(filePath, 'utf8');

      console.log(`-> Running migration: ${file}`);
      await db.query(sqlQuery);
    }

    console.log('All database migrations executed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
};

runMigrations();
