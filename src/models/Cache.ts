import mongoose, { Document, Model } from 'mongoose';
import { CacheEntry } from '../types/cache';
import { logger } from '../utils/logger';
import { getConnectionStatus } from '../config/database';
import { cacheService } from '../services/CacheService';

export type CacheType = 'service-area' | 'page-content' | 'meta' | 'sitemap';

export interface ICache extends Document {
  key: string;
  data: any;
  expires: Date;
  type: CacheType;
  createdAt: Date;
  updatedAt: Date;
}

interface ICacheModel extends Model<ICache> {
  getCache(key: string, type: CacheType): Promise<ICache | null>;
  setCache(key: string, data: any, type: CacheType, ttl?: number): Promise<ICache>;
  invalidateCache(type: CacheType): Promise<{ deletedCount?: number }>;
  invalidateCacheKey(key: string, type: CacheType): Promise<{ deletedCount?: number }>;
}

const cacheSchema = new mongoose.Schema<ICache>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    expires: {
      type: Date,
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['service-area', 'page-content', 'meta', 'sitemap'] as CacheType[],
    },
  },
  {
    timestamps: true,
  }
);

// Add index for automatic expiration
cacheSchema.index({ expires: 1 }, { expireAfterSeconds: 0 });

// Add compound index for type and key
cacheSchema.index({ type: 1, key: 1 });

// Middleware to handle cache updates
cacheSchema.pre<ICache>('save', function(next) {
  // Set default expiration if not set
  if (!this.expires) {
    const defaultTTL = 24 * 60 * 60 * 1000; // 24 hours
    this.expires = new Date(Date.now() + defaultTTL);
  }
  next();
});

// Static methods for cache management
cacheSchema.statics = {
  async getCache(key: string, type: CacheType): Promise<ICache | null> {
    try {
      if (!getConnectionStatus()) {
        logger.warn('MongoDB not connected, using in-memory cache');
        const result = await cacheService.get(key);
        return result ? { key, data: result, type } as ICache : null;
      }
      return await this.findOne({ key, type }).exec();
    } catch (error) {
      logger.error('Cache get error:', error);
      return null;
    }
  },

  async setCache(
    key: string,
    data: any,
    type: CacheType,
    ttl?: number
  ): Promise<ICache> {
    try {
      if (!getConnectionStatus()) {
        logger.warn('MongoDB not connected, using in-memory cache');
        await cacheService.set(key, data, { ttl, type });
        return { key, data, type } as ICache;
      }
      const expires = new Date(Date.now() + (ttl || 24 * 60 * 60 * 1000));
      return await this.findOneAndUpdate(
        { key, type },
        { data, expires },
        { upsert: true, new: true }
      ).exec();
    } catch (error) {
      logger.error('Cache set error:', error);
      throw error;
    }
  },

  async invalidateCache(type: CacheType): Promise<{ deletedCount?: number }> {
    try {
      if (!getConnectionStatus()) {
        logger.warn('MongoDB not connected, using in-memory cache');
        await cacheService.invalidateByType(type);
        return { deletedCount: 1 };
      }
      return await this.deleteMany({ type }).exec();
    } catch (error) {
      logger.error('Cache invalidate error:', error);
      return { deletedCount: 0 };
    }
  },

  async invalidateCacheKey(
    key: string,
    type: CacheType
  ): Promise<{ deletedCount?: number }> {
    try {
      if (!getConnectionStatus()) {
        logger.warn('MongoDB not connected, using in-memory cache');
        await cacheService.delete(key);
        return { deletedCount: 1 };
      }
      return await this.deleteOne({ key, type }).exec();
    } catch (error) {
      logger.error('Cache invalidate key error:', error);
      return { deletedCount: 0 };
    }
  },
};

// Create the model
let Cache: ICacheModel;

try {
  Cache = mongoose.models.Cache as ICacheModel || 
    mongoose.model<ICache, ICacheModel>('Cache', cacheSchema);
} catch (error) {
  logger.warn('Error creating MongoDB Cache model, using in-memory cache service');
  Cache = cacheService as unknown as ICacheModel;
}

export default Cache;
