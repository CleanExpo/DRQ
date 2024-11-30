import { MongoClient, Db, Collection, Document, Filter, WithId, OptionalUnlessRequiredId } from 'mongodb';
import { getMongoDb } from '@/lib/mongodb';

export interface BaseDocument extends Document {
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class DatabaseService {
  private db: Db | null = null;

  private async getDatabase(): Promise<Db> {
    if (!this.db) {
      this.db = await getMongoDb();
    }
    return this.db;
  }

  private async getCollection<T extends BaseDocument>(collectionName: string): Promise<Collection<T>> {
    const db = await this.getDatabase();
    return db.collection<T>(collectionName);
  }

  async healthCheck(): Promise<boolean> {
    try {
      const db = await this.getDatabase();
      await db.command({ ping: 1 });
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }

  async createIndexes(): Promise<void> {
    try {
      const db = await this.getDatabase();
      
      // Create indexes for collections
      await Promise.all([
        // Users collection indexes
        db.collection('users').createIndex(
          { email: 1 }, 
          { unique: true, background: true }
        ),
        
        // Services collection indexes
        db.collection('services').createIndex(
          { slug: 1 }, 
          { unique: true, background: true }
        ),
        
        // Enquiries collection indexes
        db.collection('enquiries').createIndex(
          { createdAt: 1 }, 
          { background: true }
        ),
        
        // Areas collection indexes
        db.collection('areas').createIndex(
          { postcode: 1 }, 
          { background: true }
        ),
      ]);
      
      console.log('Database indexes created successfully');
    } catch (error) {
      console.error('Failed to create database indexes:', error);
      throw error;
    }
  }

  // Generic CRUD operations
  async findOne<T extends BaseDocument>(
    collectionName: string,
    filter: Filter<T>
  ): Promise<T | null> {
    const collection = await this.getCollection<T>(collectionName);
    return collection.findOne(filter) as Promise<T | null>;
  }

  async find<T extends BaseDocument>(
    collectionName: string,
    filter: Filter<T>
  ): Promise<T[]> {
    const collection = await this.getCollection<T>(collectionName);
    return collection.find(filter).toArray() as Promise<T[]>;
  }

  async insertOne<T extends BaseDocument>(
    collectionName: string,
    doc: OptionalUnlessRequiredId<T>
  ): Promise<T> {
    const collection = await this.getCollection<T>(collectionName);
    const now = new Date();
    const documentToInsert = {
      ...doc,
      createdAt: now,
      updatedAt: now,
    } as OptionalUnlessRequiredId<T>;

    const result = await collection.insertOne(documentToInsert);
    return { ...documentToInsert, _id: result.insertedId } as T;
  }

  async updateOne<T extends BaseDocument>(
    collectionName: string,
    filter: Filter<T>,
    update: Partial<T>
  ): Promise<boolean> {
    const collection = await this.getCollection<T>(collectionName);
    const updateDoc = {
      $set: {
        ...update,
        updatedAt: new Date(),
      },
    };
    const result = await collection.updateOne(filter, updateDoc);
    return result.modifiedCount > 0;
  }

  async deleteOne<T extends BaseDocument>(
    collectionName: string,
    filter: Filter<T>
  ): Promise<boolean> {
    const collection = await this.getCollection<T>(collectionName);
    const result = await collection.deleteOne(filter);
    return result.deletedCount > 0;
  }
}

// Export a singleton instance
export const databaseService = new DatabaseService();
