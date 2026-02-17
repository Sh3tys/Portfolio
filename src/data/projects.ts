export interface Project {
  id: string;
  title: string;
  description: string;
  link?: string;
  image?: string;
  tags: string;
  createdAt: Date;
}

export interface SkillCategory {
  id: string;
  name: string;
  skills: string[];
}

export interface SiteContent {
  origin: {
    title: string;
    operatorName: string;
    protocol: string;
    description: string[];
    xpYears: string;
    successRate: string;
    image: string;
  };
  contact: {
    email: string;
    cvUrl: string;
    discord: string;
    twitter: string;
    location: string;
  };
}

export const staticProjects: Project[] = [
  {
    id: '1',
    title: 'Neon Nexus',
    description: 'A high-performance trading platform with real-time analytics and a futuristic dark interface.',
    tags: 'Next.js, Three.js, GSAP',
    createdAt: new Date(),
  },
  {
    id: '2',
    title: 'Void Interface',
    description: 'Minimalist command-line based portfolio for developers who prefer the terminal look.',
    tags: 'TypeScript, Tailwind, Lucide',
    createdAt: new Date(),
  }
];

export const staticSkills: SkillCategory[] = [
  { id: '1', name: 'Frontend', skills: ['React', 'Next.js', 'Three.js', 'Tailwind'] },
  { id: '2', name: 'Backend', skills: ['Node.js', 'PostgreSQL', 'Auth.js'] },
  { id: '3', name: 'Core', skills: ['TypeScript', 'JavaScript', 'Python', 'C++'] },
  { id: '4', name: 'Protocols', skills: ['API REST', 'GraphQL', 'WebSockets', 'gRPC'] },
];

export const staticSiteContent: SiteContent = {
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
