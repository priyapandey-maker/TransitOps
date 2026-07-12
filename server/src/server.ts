import app from './app';
import { env } from './config/env';
import { checkDbConnection } from './config/db';

const startServer = async () => {
  try {
    // The server should continue running even if the database is unavailable
    await checkDbConnection();

    // Start Express Server
    app.listen(env.PORT, () => {
      console.log(`[Server] TransitOps Backend is running on http://localhost:${env.PORT}`);
      console.log(`[Environment] ${env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('Unexpected error during server startup:', error);
  }
};

startServer();
