const { MongoClient } = require('mongodb');
require('dotenv').config();

async function test() {
  const uri = process.env.MONGODB_URI;
  console.log('Connecting to:', uri.split('@')[1]); // Log only the cluster part
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('Connected successfully');
    const db = client.db('portfolio');
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
  } catch (e) {
    console.error('Connection failed:', e);
  } finally {
    await client.close();
  }
}

test();
