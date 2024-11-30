import mongoose from 'mongoose';
import { logger } from '../utils/logger';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/drq-website';
const MAX_RETRIES = process.env.NODE_ENV === 'production' ? 10 : 5;
const RETRY_DELAY = process.env.NODE_ENV === 'production' ? 10000 : 5000;
const POOL_SIZE = process.env.NODE_ENV === 'production' ? 50 : 10;

let isConnected = false;
let inMemoryFallback = false;
let retryCount = 0;
let healthCheckInterval: NodeJS.Timeout | null = null;

// Simple in-memory store for development fallback
const inMemoryStore = new Map();

// Connection options based on environment
const getConnectionOptions = () => ({
  connectTimeoutMS: process.env.NODE_ENV === 'production' ? 30000 : 10000,
  socketTimeoutMS: process.env.NODE_ENV === 'production' ? 60000 : 45000,
  serverSelectionTimeoutMS: process.env.NODE_ENV === 'production' ? 30000 : 10000,
  heartbeatFrequencyMS: process.env.NODE_ENV === 'production' ? 10000 : 30000,
  maxPoolSize: POOL_SIZE,
  minPoolSize: Math.floor(POOL_SIZE / 5),
  retryWrites: true,
  retryReads: true,
  w: process.env.NODE_ENV === 'production' ? 'majority' : 1,
  readPreference: process.env.NODE_ENV === 'production' ? 'primaryPreferred' : 'primary',
});

// Health check function
const performHealthCheck = async () => {
  if (!isConnected || inMemoryFallback) return;

  try {
    await mongoose.connection.db.admin().ping();
    logger.debug('MongoDB health check passed');
  } catch (error) {
    logger.error('MongoDB health check failed:', error);
    await handleConnectionError(error);
  }
};

// Error handling function
const handleConnectionError = async (error: any) => {
  logger.error('MongoDB connection error:', error);

  if (process.env.NODE_ENV === 'development') {
    if (!inMemoryFallback) {
      logger.info('Switching to in-memory store in development');
      inMemoryFallback = true;
      isConnected = true;
    }
    return;
  }

  if (retryCount < MAX_RETRIES) {
    retryCount++;
    logger.info(`Retrying connection (${retryCount}/${MAX_RETRIES}) in ${RETRY_DELAY/1000} seconds...`);
    setTimeout(() => connectToDatabase(), RETRY_DELAY);
  } else {
    logger.error('Max retry attempts reached. Unable to establish MongoDB connection');
    process.exit(1); // Exit in production after max retries
  }
};

export async function connectToDatabase() {
  try {
    if (isConnected) {
      logger.info('Using existing MongoDB connection');
      return;
    }

    if (process.env.NODE_ENV === 'development' && !process.env.MONGODB_URI) {
      logger.info('Using in-memory store for development');
      inMemoryFallback = true;
      isConnected = true;
      return;
    }

    // Configure mongoose
    mongoose.set('strictQuery', true);

    // Create the connection
    await mongoose.connect(MONGODB_URI, getConnectionOptions());

    // Connection events
    mongoose.connection.on('connected', () => {
      isConnected = true;
      retryCount = 0;
      logger.info('Connected to MongoDB');

      // Start health checks in production
      if (process.env.NODE_ENV === 'production' && !healthCheckInterval) {
        healthCheckInterval = setInterval(performHealthCheck, 30000);
      }
    });

    mongoose.connection.on('error', handleConnectionError);

    mongoose.connection.on('disconnected', () => {
      isConnected = false;
      logger.warn('MongoDB disconnected');
      handleConnectionError(new Error('MongoDB disconnected'));
    });

    mongoose.connection.on('reconnected', () => {
      isConnected = true;
      retryCount = 0;
      logger.info('MongoDB reconnected');
    });

    // Handle process termination
    process.on('SIGINT', async () => {
      await disconnectFromDatabase();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      await disconnectFromDatabase();
      process.exit(0);
    });

  } catch (error) {
    await handleConnectionError(error);
  }
}

export async function disconnectFromDatabase() {
  try {
    if (!isConnected) {
      logger.info('No connection to close');
      return;
    }

    if (healthCheckInterval) {
      clearInterval(healthCheckInterval);
      healthCheckInterval = null;
    }

    if (!inMemoryFallback) {
      await mongoose.connection.close();
      logger.info('Disconnected from MongoDB');
    }

    isConnected = false;
    inMemoryFallback = false;
  } catch (error) {
    logger.error('Failed to disconnect:', error);
    throw error;
  }
}

// Helper functions for in-memory store
export function getInMemoryStore() {
  return inMemoryStore;
}

export function isUsingInMemoryStore() {
  return inMemoryFallback;
}

// Connection status and health
export function getConnectionStatus() {
  return {
    isConnected,
    isUsingFallback: inMemoryFallback,
    retryCount,
    poolSize: POOL_SIZE,
    uri: MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'), // Hide credentials
  };
}

// Initialize connection
if (process.env.NODE_ENV !== 'test') {
  connectToDatabase().catch((error) => {
    logger.error('Initial connection failed:', error);
    if (process.env.NODE_ENV === 'development') {
      logger.info('Using in-memory store fallback');
      inMemoryFallback = true;
      isConnected = true;
    } else {
      process.exit(1); // Exit in production if initial connection fails
    }
  });
}
