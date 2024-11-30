import clientPromise from '@/lib/mongodb';
import { Collection } from 'mongodb';

interface CacheItem {
  key: string;
  value: any;
  expiresAt: Date;
}

class Cache {
  private collection: Promise<Collection<CacheItem>>;

  constructor() {
    this.collection = this.initializeCollection();
  }

  private async initializeCollection(): Promise<Collection<CacheItem>> {
    const client = await clientPromise;
    const db = client.db('drq-cache');
    return db.collection<CacheItem>('cache');
  }

  async set(key: string, value: any, ttlSeconds: number = 3600): Promise<void> {
    const collection = await this.collection;
    const expiresAt = new Date(Date.now() + ttlSeconds * 1000);

    await collection.updateOne(
      { key },
      {
        $set: {
          value,
          expiresAt,
        },
      },
      { upsert: true }
    );
  }

  async get(key: string): Promise<any | null> {
    const collection = await this.collection;
    const item = await collection.findOne({
      key,
      expiresAt: { $gt: new Date() },
    });

    return item ? item.value : null;
  }

  async delete(key: string): Promise<void> {
    const collection = await this.collection;
    await collection.deleteOne({ key });
  }

  async clear(): Promise<void> {
    const collection = await this.collection;
    await collection.deleteMany({});
  }

  async cleanup(): Promise<void> {
    const collection = await this.collection;
    await collection.deleteMany({
      expiresAt: { $lte: new Date() },
    });
  }
}

// Export a singleton instance
export const cache = new Cache();

// Cleanup expired items periodically (every hour)
if (typeof window === 'undefined') { // Only run on server
  setInterval(() => {
    cache.cleanup().catch(console.error);
  }, 3600000);
}
