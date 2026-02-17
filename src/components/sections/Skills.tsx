'use client';

import { motion } from 'framer-motion';
import { Terminal, Cpu, Database, Layout, Code, Zap } from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  'Frontend': Layout,
  'Backend': Database,
  'Core': Code,
  'Protocols': Cpu,
};

export const Skills = ({ skills: initialSkills }: { skills?: any[] }) => {
  // If no skills passed, we could fallback, but page.tsx handles this
  const skills = initialSkills || [];

  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-secondary/5 rounded-full blur-[100px] -z-10" />

      <div className="container mx-auto px-4">
        <div className="mb-16">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-2 block italic">
            Capability // Arsenal
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase">
            TECHNICAL_STACK
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((category, idx) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="glass p-8 rounded-sm border border-white/5 hover:border-primary/20 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-primary/5 rounded-sm flex items-center justify-center mb-6 border border-white/5 group-hover:border-primary/40 transition-colors">
                {(() => {
                  const Icon = ICON_MAP[category.name] || Terminal;
                  return <Icon className="w-6 h-6 text-primary" />;
                })()}
              </div>
              <h3 className="text-xl font-bold font-mono mb-6 tracking-widest uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-white to-white/40 group-hover:from-primary group-hover:to-white transition-all duration-500">
                {category.name}
              </h3>
              <ul className="space-y-4">
                {category.skills.map((skill: string) => (
                  <li key={skill} className="flex items-center gap-3 text-sm font-light text-foreground/50 border-b border-white/5 pb-2">
                    <Zap className="w-3 h-3 text-primary/40 group-hover:text-primary transition-colors" />
                    {skill}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        
        {/* Terminal decorative block */}
        <div className="mt-16 glass p-6 rounded-sm border border-white/5 font-mono text-xs text-foreground/30 flex items-center gap-4 overflow-hidden">
           <div className="flex gap-1.5 basis-12">
              <div className="w-2 h-2 rounded-full bg-red-500/20" />
              <div className="w-2 h-2 rounded-full bg-yellow-500/20" />
              <div className="w-2 h-2 rounded-full bg-green-500/20" />
           </div>
           <div className="h-4 w-[1px] bg-white/10" />
           <p className="marquee whitespace-nowrap">
             {`// [SYSTEM_INFO] Scanning local modules... Done. // [COMPETENCY] 100% verified // Root access granted // Initializing advanced_logic.js...`}
           </p>
        </div>
      </div>
    </section>
  );
};
