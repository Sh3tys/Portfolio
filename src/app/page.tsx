export const dynamic = 'force-dynamic';
import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/sections/Hero';
import { Skills } from '@/components/sections/Skills';
import { Contact } from '@/components/sections/Contact';
import { ExperienceSection } from '@/components/sections/Experience';
import { getProjects, getSiteContent, getSkills, getExperiences } from '@/app/actions/projects';
import { staticProjects, staticSiteContent, staticSkills, staticExperiences } from '@/data/projects';
import { ExternalLink, Github, Code2, Shield, User } from 'lucide-react';
import Image from 'next/image';

export default async function Home() {
  let projects = await getProjects();
  let content = await getSiteContent();
  let skills = await getSkills();
  let experiences = await getExperiences();

  if (projects.length === 0) projects = staticProjects as any;
  if (!content) content = staticSiteContent as any;
  if (skills.length === 0) skills = staticSkills as any;
  if (experiences.length === 0) experiences = staticExperiences as any;

  return (
    <main className="min-h-screen bg-background relative selection:bg-primary/30 selection:text-white">
      <Navbar />
      <Hero />
      <Skills skills={skills} />
      <ExperienceSection experiences={experiences} />
      
      {/* Projects Section */}
      <section id="projects" className="py-24 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-2 block">
                Archive // Operations
              </span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">
                ACTIVE_MISSIONS
              </h2>
            </div>
            <div className="h-[1px] flex-grow bg-white/5 mx-8 hidden md:block mb-4" />
            <div className="font-mono text-[10px] text-white/20 uppercase tracking-widest mb-2">
              Showing {projects.length} results
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.length === 0 ? (
              <div className="col-span-full py-20 glass border border-dashed border-white/10 flex flex-col items-center justify-center opacity-40">
                <Code2 className="w-12 h-12 mb-4" />
                <p className="font-mono text-sm uppercase tracking-widest">Awaiting data injection...</p>
              </div>
            ) : (
              projects.map((project: any) => (
                <div key={project.id} className="group relative glass rounded-sm overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-500">
                  {/* Image Placeholder or Actual Image */}
                  <div className="aspect-video relative overflow-hidden bg-white/5">
                    {project.image ? (
                      <img 
                        src={project.image} 
                        alt={project.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Code2 className="w-12 h-12 text-white/5 group-hover:text-primary/20 transition-colors" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                  </div>

                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.split(',').map((tag: string) => (
                        <span key={tag} className="text-[9px] font-mono uppercase px-2 py-1 bg-white/5 border border-white/10 rounded-full text-foreground/40">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors uppercase tracking-tight">
                      {project.title}
                    </h3>
                    <p className="text-sm text-foreground/60 mb-6 line-clamp-2 font-light leading-relaxed">
                      {project.description}
                    </p>
                    
                    <div className="flex items-center gap-4">
                      {project.link && (
                        <a 
                          href={project.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-xs font-mono uppercase text-primary hover:text-white transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" /> View_Live
                        </a>
                      )}
                      <div className="flex-grow" />
                      <div className="w-2 h-2 rounded-full bg-primary/20 group-hover:bg-primary transition-colors shadow-[0_0_10px_rgba(0,242,255,0)] group-hover:shadow-[0_0_10px_rgba(0,242,255,0.5)]" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="relative group mx-auto lg:mx-0">
              {/* Massive Outer HUD Ring */}
              <div className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] relative flex items-center justify-center">
                {/* Rotating HUD Layers */}
                <div className="absolute inset-0 rounded-full border border-primary/10 animate-[spin_20s_linear_infinite]" />
                <div className="absolute inset-4 rounded-full border border-dashed border-primary/20 animate-[spin_15s_linear_infinite_reverse]" />
                <div className="absolute inset-8 rounded-full border-2 border-primary/5 animate-[pulse_4s_ease-in-out_infinite]" />
                
                {/* Image Container */}
                <div className="w-[260px] h-[260px] md:w-[320px] md:h-[320px] rounded-full overflow-hidden relative z-10 border-2 border-primary/40 shadow-[0_0_60px_rgba(0,242,255,0.15)]">
                  {content.origin.image ? (
                    <img 
                      src={content.origin.image} 
                      alt={content.origin.operatorName}
                      className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-1000"
                    />
                  ) : (
                    <div className="w-full h-full bg-black/50 flex items-center justify-center">
                      <Shield className="w-24 h-24 text-primary" />
                    </div>
                  )}
                  
                  {/* Digital Scanning Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-primary/10 pointer-events-none mix-blend-overlay opacity-30" />
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20" />
                </div>

                {/* Decorative Digital Elements (Corners/Markers) */}
                <div className="absolute -top-2 -left-2 w-10 h-10 border-t-2 border-l-2 border-primary/60 glow-primary" />
                <div className="absolute -bottom-2 -right-2 w-10 h-10 border-b-2 border-r-2 border-primary/60 glow-primary" />
                
                {/* Data Readouts - Moved to LEFT to avoid overlapping text column */}
                <div className="absolute -left-12 top-1/4 hidden md:block">
                  <div className="font-mono text-[8px] text-primary space-y-1 bg-black/40 p-2 border-l border-primary/40">
                    <p>BIO_RECOGNITION: OK</p>
                    <p>ID: {content.origin.operatorName}</p>
                    <p>STATUS: ACTIVE</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-2 block">
                  Identity // Background
                </span>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase mb-6">
                  {content.origin.title}
                </h2>
                <div className="space-y-4 text-foreground/70 font-light leading-relaxed">
                  {content.origin.description.map((p: string, i: number) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                 <div className="glass p-4 border-l-2 border-primary/50">
                    <p className="text-[10px] font-mono text-white/30 uppercase mb-1">XP_LEVEL</p>
                    <p className="text-xl font-bold tracking-tighter">{content.origin.xpYears}</p>
                 </div>
                 <div className="glass p-4 border-l-2 border-secondary/50">
                    <p className="text-[10px] font-mono text-white/30 uppercase mb-1">SUCCESS_RATE</p>
                    <p className="text-xl font-bold tracking-tighter">{content.origin.successRate}</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Contact content={content} />
      
      {/* Decorative footer line */}
      <section className="py-20 border-t border-white/5 relative z-10 glass">
         <div className="container mx-auto px-4 text-center">
            <h3 className="text-xs font-mono uppercase tracking-[0.5em] text-foreground/20 mb-8 italic">
              Secure transmission terminated
            </h3>
            <div className="flex justify-center gap-8">
               <Github className="w-5 h-5 text-foreground/20 hover:text-primary transition-colors cursor-pointer" />
               <ExternalLink className="w-5 h-5 text-foreground/20 hover:text-primary transition-colors cursor-pointer" />
            </div>
         </div>
      </section>
      
      <footer className="py-10 border-t border-white/5 relative z-10 bg-black/50">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="font-mono text-[10px] text-foreground/40 uppercase tracking-widest">
            © 2026 TITOUAN.SYS // ALL RIGHTS RESERVED
          </p>
          <div className="flex gap-6">
             <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
             <span className="font-mono text-[10px] text-primary uppercase tracking-widest">System Online</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
