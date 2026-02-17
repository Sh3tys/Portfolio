'use client';

import React from 'react';
import { Mail, Link as LinkIcon, Download } from 'lucide-react';

export const Contact = ({ content }: { content: any }) => {
  const { contact } = content;
  
  return (
    <section id="contact" className="py-24 relative z-10 glass">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4 block">
             Secure // Communication
          </span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase mb-8 italic">
             ESTABLISH_SIGNAL
          </h2>
          <p className="text-foreground/50 font-mono text-sm max-w-xl mx-auto mb-12">
             Ready to initialize a new collaboration? Transmit your parameters and let's build something experimental.
          </p>
          
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <a 
              href={`mailto:${contact.email}`} 
              className="group relative px-12 py-5 bg-primary text-background font-bold uppercase tracking-widest text-sm overflow-hidden transition-all hover:pr-14 hover:pl-10"
            >
              <span className="relative z-10">TRANSMIT_MESSAGE</span>
              <div className="absolute inset-0 bg-white translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 opacity-20" />
            </a>
            <a 
              href={contact.cvUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="px-12 py-5 border border-white/10 hover:border-primary/50 transition-colors font-mono uppercase tracking-widest text-sm inline-block text-center hover:bg-white/5"
            >
              Download_CV.pdf
            </a>
          </div>

          <div className="mt-20 pt-8 border-t border-white/5 flex flex-wrap justify-center gap-12 text-xs font-mono text-foreground/40 uppercase tracking-[0.2em]">
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Discord: {contact.discord}
             </div>
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                X/Twitter: {contact.twitter}
             </div>
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                Location: {contact.location}
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};
