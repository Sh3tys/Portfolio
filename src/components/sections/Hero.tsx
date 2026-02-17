'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ChevronRight } from 'lucide-react';

const HeroScene = dynamic(() => import('@/components/canvas/HeroScene'), { ssr: false });

export const Hero = () => {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background 3D */}
      <HeroScene />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <span className="inline-block px-3 py-1 mb-6 text-xs font-mono tracking-widest uppercase border border-primary/30 rounded-full bg-primary/5 text-primary">
            System Protocol 01 // Initialized
          </span>
          <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tighter">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/40">TITOUAN</span>
            <br />
            <span className="text-primary text-glow-primary">DEVELOPER</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-foreground/60 mb-10 font-light leading-relaxed">
            Crafting futuristic digital experiences through high-performance code and avant-garde design.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              glow 
              className="group"
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View Missions
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Contact Admin
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-10 left-10 hidden md:block">
        <div className="flex items-center gap-4 font-mono text-[10px] text-primary/40 uppercase tracking-[0.2em]">
          <div className="w-12 h-[1px] bg-primary/40" />
          <span>Lat: 48.8566 // Lon: 2.3522</span>
        </div>
      </div>
      
      <div className="absolute top-1/2 right-10 -translate-y-1/2 hidden lg:block rotate-90">
        <div className="flex items-center gap-4 font-mono text-[10px] text-primary/40 uppercase tracking-[0.2em]">
          <span>Scroll to explore</span>
          <div className="w-12 h-[1px] bg-primary/40" />
        </div>
      </div>
    </section>
  );
};
