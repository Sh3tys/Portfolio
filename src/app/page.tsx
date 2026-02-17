export const dynamic = 'force-dynamic';
import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/sections/Hero';
import { Skills } from '@/components/sections/Skills';
import { Contact } from '@/components/sections/Contact';
import { getProjects, getSiteContent, getSkills } from '@/app/actions/projects';
import { staticProjects, staticSiteContent, staticSkills } from '@/data/projects';
import { ExternalLink, Github, Code2, Shield, User } from 'lucide-react';
import Image from 'next/image';

export default async function Home() {
  let projects = await getProjects();
  let content = await getSiteContent();
  let skills = await getSkills();

  if (projects.length === 0) projects = staticProjects as any;
  if (!content) content = staticSiteContent as any;
  if (skills.length === 0) skills = staticSkills as any;

  return (
    <main className="min-h-screen bg-background relative selection:bg-primary/30 selection:text-white">
      <Navbar />
      <Hero />
      <Skills skills={skills} />
      
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
                      <Image 
                        src={project.image} 
                        alt={project.title} 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-square glass rounded-sm border border-white/10 flex items-center justify-center p-8 relative overflow-hidden group">
                 <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                 <div className="relative text-center">
                    <div className="text-8xl font-bold tracking-tighter text-white/5 absolute -top-10 -left-10 select-none">ORIGIN</div>
                    <div className="w-32 h-32 rounded-full border-2 border-dashed border-primary/30 flex items-center justify-center mb-6 animate-spin-slow">
                       {content.origin.image ? (
                         <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border border-primary/40 relative">
                           <Image 
                             src={content.origin.image} 
                             alt={content.origin.operatorName}
                             fill
                             className="object-cover"
                           />
                         </div>
                       ) : (
                         <Shield className="w-12 h-12 text-primary" />
                       )}
                    </div>
                    <h3 className="text-2xl font-bold italic tracking-widest uppercase">{content.origin.operatorName}</h3>
                    <p className="text-xs font-mono text-primary/60 uppercase mt-2 Tracking-widest">Protocol: {content.origin.protocol}</p>
                 </div>
              </div>
              {/* Decorative corners */}
              <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-primary/40" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-primary/40" />
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
