const { MongoClient } = require('mongodb');
require('dotenv').config();

async function run() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('portfolio');
    
    // Clean content
    await db.collection('content').updateMany({}, { $unset: { id: "" } });
    console.log('CLEANED_CONTENT_COLLECTION');
    
    // Clean projects
    await db.collection('projects').updateMany({}, { $unset: { id: "" } });
    console.log('CLEANED_PROJECTS_COLLECTION');
    
    // Clean skills
    await db.collection('skills').updateMany({}, { $unset: { id: "" } });
    console.log('CLEANED_SKILLS_COLLECTION');
    
  } finally {
    await client.close();
  }
}

run().catch(console.error);
