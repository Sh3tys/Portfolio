const { MongoClient } = require('mongodb');
require('dotenv').config();

async function run() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('portfolio');
    const content = await db.collection('content').findOne({ type: 'global' });
    console.log('SITE_CONTENT:', JSON.stringify(content, null, 2));
    
    const projects = await db.collection('projects').find({}).toArray();
    console.log('PROJECTS_COUNT:', projects.length);
  } finally {
    await client.close();
  }
}

run().catch(console.error);
