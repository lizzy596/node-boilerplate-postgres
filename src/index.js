// const { Pool } = require('pg');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const pool = require('./config/db'); // Import the pool from db.js

let server;

// Initialize the PostgreSQL connection pool
// Make sure your config file provides the appropriate connection string or client config
// console.log('Connecting with config:', config.postgres);
// const pool = new Pool(config.postgres); // or config.postgres.url depending on your config structure

// Test the connection before starting the server
pool
  .connect()
  .then((client) => {
    client.release(); // Release the client back to the pool
    logger.info('Connected to PostgreSQL');

    server = app.listen(config.port, () => {
      logger.info(`Listening to port ${config.port}`);
    });
  })
  .catch((err) => {
    logger.error('Failed to connect to PostgreSQL', err);
    process.exit(1);
  });

const exitHandler = async () => {
  try {
    // Gracefully close the PostgreSQL connection pool
    await pool.end();
    logger.info('Database pool closed');
  } catch (error) {
    logger.error('Error closing database pool', error);
  }

  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', async () => {
  logger.warn('SIGTERM received, shutting down gracefully');
  await pool.end();
  if (server) {
    server.close();
  }
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.warn('Server closed through app termination (SIGINT)');
  await pool.end();
  if (server) {
    server.close();
  }
  process.exit(0);
});
