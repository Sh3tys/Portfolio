'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Shield } from 'lucide-react';

const navItems = [
  { name: 'Missions', href: '#projects' },
  { name: 'Arsenal', href: '#skills' },
  { name: 'Origin', href: '#about' },
  { name: 'Signal', href: '#contact' },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'py-4 glass border-b' : 'py-8'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-sm bg-primary flex items-center justify-center text-background font-bold text-xl group-hover:rotate-45 transition-transform duration-300">
            T
          </div>
          <span className="font-mono text-xl tracking-tighter font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            TITOUAN<span className="text-primary">.SYS</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/60 hover:text-primary transition-colors relative group"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
          
          <Link
            href="/admin"
            className="p-2 border border-white/10 rounded-sm hover:border-primary/50 transition-colors text-foreground/40 hover:text-primary"
            title="Admin Login"
          >
            <Shield className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-b border-primary/20 overflow-hidden"
          >
            <div className="flex flex-col p-8 gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="font-mono text-xl uppercase tracking-widest text-foreground/80 hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/admin"
                className="flex items-center gap-2 font-mono text-sm text-foreground/40"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Shield className="w-4 h-4" /> ADMIN_AUTH
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
