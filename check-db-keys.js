const { MongoClient } = require('mongodb');
require('dotenv').config();

async function run() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('portfolio');
    const content = await db.collection('content').findOne({ type: 'global' });
    if (content) {
      console.log('KEYS:', Object.keys(content));
      console.log('ORIGIN_KEYS:', Object.keys(content.origin || {}));
      console.log('OPERATOR_NAME:', content.origin?.operatorName);
      console.log('IMAGE_LENGTH:', content.origin?.image?.length);
    } else {
      console.log('NO_CONTENT_FOUND');
    }
  } finally {
    await client.close();
  }
}

run().catch(console.error);
