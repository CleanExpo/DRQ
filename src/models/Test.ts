import mongoose, { Document, Model, Schema } from 'mongoose';
import { getInMemoryStore, isUsingInMemoryStore } from '../config/database';
import { logger } from '../utils/logger';

// Interfaces
export interface ITest {
  name: string;
  date: Date;
  status: 'active' | 'inactive' | 'archived';
  metadata?: Record<string, any>;
  version: number;
  lastUpdated?: Date;
}

export interface ITestDocument extends ITest, Document {
  setStatus(status: ITest['status']): Promise<void>;
  archive(): Promise<void>;
  updateMetadata(metadata: Record<string, any>): Promise<void>;
}

interface ITestModel extends Model<ITestDocument> {
  findByName(name: string): Promise<ITestDocument[]>;
  findActive(): Promise<ITestDocument[]>;
  createWithMetadata(data: Partial<ITest>, metadata: Record<string, any>): Promise<ITestDocument>;
}

// Schema
const testSchema = new Schema<ITestDocument, ITestModel>({
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be longer than 100 characters'],
    index: true
  },
  date: { 
    type: Date, 
    default: Date.now,
    index: true
  },
  status: {
    type: String,
    enum: {
      values: ['active', 'inactive', 'archived'],
      message: '{VALUE} is not a valid status'
    },
    default: 'active',
    index: true
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  },
  version: {
    type: Number,
    default: 1
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  versionKey: false,
  collection: 'tests'
});

// Indexes
testSchema.index({ name: 1, status: 1 });
testSchema.index({ date: 1, status: 1 });

// Methods
testSchema.methods.setStatus = async function(status: ITest['status']): Promise<void> {
  this.status = status;
  this.lastUpdated = new Date();
  this.version += 1;
  await this.save();
};

testSchema.methods.archive = async function(): Promise<void> {
  await this.setStatus('archived');
};

testSchema.methods.updateMetadata = async function(metadata: Record<string, any>): Promise<void> {
  this.metadata = { ...this.metadata, ...metadata };
  this.lastUpdated = new Date();
  this.version += 1;
  await this.save();
};

// Statics
testSchema.statics.findByName = function(name: string): Promise<ITestDocument[]> {
  return this.find({ name: new RegExp(name, 'i'), status: { $ne: 'archived' } });
};

testSchema.statics.findActive = function(): Promise<ITestDocument[]> {
  return this.find({ status: 'active' });
};

testSchema.statics.createWithMetadata = async function(
  data: Partial<ITest>, 
  metadata: Record<string, any>
): Promise<ITestDocument> {
  return this.create({
    ...data,
    metadata,
    lastUpdated: new Date()
  });
};

// Middleware
testSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// In-memory store implementation
const COLLECTION_NAME = 'tests';
let inMemoryIdCounter = 1;

export class TestModel {
  static async create(data: Partial<ITest>): Promise<ITest> {
    try {
      if (isUsingInMemoryStore()) {
        const store = getInMemoryStore();
        const collection = store.get(COLLECTION_NAME) || [];
        const newDoc = {
          _id: String(inMemoryIdCounter++),
          ...data,
          date: data.date || new Date(),
          status: data.status || 'active',
          metadata: data.metadata || {},
          version: 1,
          lastUpdated: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        collection.push(newDoc);
        store.set(COLLECTION_NAME, collection);
        return newDoc;
      }
      
      const Test = mongoose.model<ITestDocument, ITestModel>('Test', testSchema);
      return Test.create(data);
    } catch (error) {
      logger.error('Error creating test document:', error);
      throw error;
    }
  }

  static async findAll(filter: Partial<ITest> = {}): Promise<ITest[]> {
    try {
      if (isUsingInMemoryStore()) {
        const store = getInMemoryStore();
        const collection = store.get(COLLECTION_NAME) || [];
        return collection.filter(doc => 
          Object.entries(filter).every(([key, value]) => doc[key] === value)
        );
      }

      const Test = mongoose.model<ITestDocument, ITestModel>('Test', testSchema);
      return Test.find(filter).sort({ date: -1 });
    } catch (error) {
      logger.error('Error finding test documents:', error);
      throw error;
    }
  }

  static async findActive(): Promise<ITest[]> {
    return this.findAll({ status: 'active' });
  }

  static async updateById(id: string, update: Partial<ITest>): Promise<ITest | null> {
    try {
      if (isUsingInMemoryStore()) {
        const store = getInMemoryStore();
        const collection = store.get(COLLECTION_NAME) || [];
        const index = collection.findIndex(doc => doc._id === id);
        if (index === -1) return null;

        const updatedDoc = {
          ...collection[index],
          ...update,
          version: collection[index].version + 1,
          lastUpdated: new Date(),
          updatedAt: new Date()
        };
        collection[index] = updatedDoc;
        store.set(COLLECTION_NAME, collection);
        return updatedDoc;
      }

      const Test = mongoose.model<ITestDocument, ITestModel>('Test', testSchema);
      return Test.findByIdAndUpdate(
        id,
        { ...update, $inc: { version: 1 } },
        { new: true, runValidators: true }
      );
    } catch (error) {
      logger.error('Error updating test document:', error);
      throw error;
    }
  }

  static async deleteById(id: string): Promise<boolean> {
    try {
      if (isUsingInMemoryStore()) {
        const store = getInMemoryStore();
        const collection = store.get(COLLECTION_NAME) || [];
        const index = collection.findIndex(doc => doc._id === id);
        if (index === -1) return false;

        collection.splice(index, 1);
        store.set(COLLECTION_NAME, collection);
        return true;
      }

      const Test = mongoose.model<ITestDocument, ITestModel>('Test', testSchema);
      const result = await Test.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      logger.error('Error deleting test document:', error);
      throw error;
    }
  }
}
