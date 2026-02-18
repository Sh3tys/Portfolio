import { Experience } from "@/data/projects";
import { Briefcase, ExternalLink, Calendar } from "lucide-react";
import Image from "next/image";

export function ExperienceSection({ experiences }: { experiences: Experience[] }) {
  if (experiences.length === 0) return null;

  return (
    <section id="experience" className="py-24 relative z-10 border-t border-white/5 bg-black/20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-16 text-center">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-orange-500 mb-4 block">
            Career // Timeline
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase">
            Mission_History
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-transparent via-orange-500 to-transparent mt-6 mb-2" />
          <p className="text-xs font-mono text-foreground/40 uppercase tracking-widest">
            Professional Trajectory Analysis
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <div key={exp.id} className={`relative flex flex-col md:flex-row gap-8 ${
                index % 2 === 0 ? 'md:flex-row-reverse' : ''
              }`}>
                {/* Timeline Dot */}
                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-black border-2 border-orange-500 z-10 shadow-[0_0_10px_rgba(249,115,22,0.5)] mt-6" />

                {/* Content Card */}
                <div className="pl-20 md:pl-0 md:w-1/2 md:px-12">
                  <div className="glass p-8 border-l-2 border-l-orange-500/50 hover:border-l-orange-500 transition-colors group relative overflow-hidden">
                    {/* Background Tech Effect */}
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Briefcase className="w-24 h-24 text-orange-500" />
                    </div>

                    <div className="flex items-start justify-between mb-4 relative z-10">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/5 rounded-sm flex items-center justify-center border border-white/10 p-2">
                           {exp.image ? (
                             <img src={exp.image} alt={exp.company} className="w-full h-full object-contain" />
                           ) : (
                             <Briefcase className="w-6 h-6 text-white/20" />
                           )}
                        </div>
                        <div>
                           <h3 className="text-xl font-bold tracking-tight uppercase group-hover:text-orange-500 transition-colors">
                             {exp.company}
                           </h3>
                           <span className="text-xs font-mono text-foreground/40 uppercase tracking-wider block mt-1">
                             {exp.role}
                           </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-foreground/70 leading-relaxed mb-6 font-light border-l border-white/5 pl-4">
                      {exp.description}
                    </p>

                    <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wide border-t border-white/5 pt-4">
                       <div className="flex items-center gap-2 text-orange-500/80">
                         <Calendar className="w-3.5 h-3.5" />
                         {exp.duration}
                       </div>
                       
                       {exp.link && (
                         <a 
                           href={exp.link} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="flex items-center gap-2 text-foreground/40 hover:text-orange-500 transition-colors"
                         >
                           Visit_Link <ExternalLink className="w-3.5 h-3.5" />
                         </a>
                       )}
                    </div>
                  </div>
                </div>
                
                {/* Empty space for the other side */}
                <div className="hidden md:block md:w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
