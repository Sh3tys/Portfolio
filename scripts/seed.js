const { MongoClient } = require('mongodb');
require('dotenv').config();

const staticProjects = [
  {
    title: 'Neon Nexus',
    description: 'A high-performance trading platform with real-time analytics and a futuristic dark interface.',
    tags: 'Next.js, Three.js, GSAP',
    createdAt: new Date(),
  },
  {
    title: 'Void Interface',
    description: 'Minimalist command-line based portfolio for developers who prefer the terminal look.',
    tags: 'TypeScript, Tailwind, Lucide',
    createdAt: new Date(),
  }
];

const staticSkills = [
  { name: 'Frontend', skills: ['React', 'Next.js', 'Three.js', 'Tailwind'] },
  { name: 'Backend', skills: ['Node.js', 'PostgreSQL', 'Auth.js'] },
  { name: 'Core', skills: ['TypeScript', 'JavaScript', 'Python', 'C++'] },
  { name: 'Protocols', skills: ['API REST', 'GraphQL', 'WebSockets', 'gRPC'] },
];

const staticSiteContent = {
  type: 'global',
  origin: {
    title: 'MISSION_ORIGIN',
    operatorName: 'Operator_01',
    protocol: 'Full_Stack_Entity',
    description: [
      "Initialized in the digital void, I've spent years synthesizing complex code into fluid interfaces. My core logic is built on innovation and precision.",
      "I specialize in building high-performance decentralized systems, immersive 3D experiences, and robust architectures that stand the test of time (or bit rot)."
    ],
    xpYears: '5+ YEARS',
    successRate: '100%_COMMIT',
    image: '/me.jpg'
  },
  contact: {
    email: 'contact@example.com',
    cvUrl: '#',
    discord: 'operator_01',
    twitter: 'titouan_dev',
    location: '[HIDDEN]'
  }
};

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not found in environment');
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('portfolio');

    // Seed Projects
    const projectsCol = db.collection('projects');
    const projectCount = await projectsCol.countDocuments();
    if (projectCount === 0) {
      await projectsCol.insertMany(staticProjects);
      console.log('✅ Projects seeded');
    }

    // Seed Skills
    const skillsCol = db.collection('skills');
    const skillCount = await skillsCol.countDocuments();
    if (skillCount === 0) {
      await skillsCol.insertMany(staticSkills);
      console.log('✅ Skills seeded');
    }

    // Seed Content
    const contentCol = db.collection('content');
    const contentExists = await contentCol.findOne({ type: 'global' });
    if (!contentExists) {
      await contentCol.insertOne(staticSiteContent);
      console.log('✅ Site content seeded');
    }

    console.log('🚀 Database initialization complete.');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await client.close();
  }
}

seed();
