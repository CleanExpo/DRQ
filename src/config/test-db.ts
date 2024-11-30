import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

async function testConnection() {
  try {
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    console.log('MongoDB Memory Server URI:', mongoUri);

    await mongoose.connect(mongoUri);
    console.log('Successfully connected to MongoDB Memory Server');

    // Create a test collection
    const testSchema = new mongoose.Schema({
      name: String,
      date: { type: Date, default: Date.now }
    });

    const Test = mongoose.model('Test', testSchema);
    await Test.create({ name: 'test entry' });
    console.log('Successfully created test entry');

    const count = await Test.countDocuments();
    console.log('Number of documents:', count);

    await mongoose.disconnect();
    await mongoServer.stop();
    console.log('Cleanup complete');

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testConnection();
