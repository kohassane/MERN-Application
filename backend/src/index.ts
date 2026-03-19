import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import app from './app';
import connectDB from './config/database';

const PORT = parseInt(process.env.PORT || '5000', 10);

async function startServer(): Promise<void> {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
      console.log(`API available at: http://localhost:${PORT}/api`);
      console.log(`Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received. Closing server...');
  await mongoose.disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received. Closing server...');
  await mongoose.disconnect();
  process.exit(0);
});

startServer();
