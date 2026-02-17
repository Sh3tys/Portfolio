'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Shield, Lock, User } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Bot trap
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Bot Detection: If honeypot is filled, it's a bot
    if (honeypot) {
      console.warn('BOT_DETECTION_TRIGGERED: SHADOW_TRAP_ACTIVE');
      // Silently fail to confuse the bot
      setError('Access forbidden by security protocol.');
      return;
    }

    setLoading(true);
    setError('');

    // Tactical Delay: Slow down brute-force attempts
    await new Promise(r => setTimeout(r, 1000));

    const result = await signIn('credentials', {
      username,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError('Invalid credentials access denied.');
      setLoading(false);
    } else {
      router.push('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md glass p-8 rounded-sm border border-primary/20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold font-mono tracking-widest uppercase">Admin Authority</h1>
          <p className="text-foreground/40 text-sm mt-2 uppercase tracking-tighter">Enter security clearance</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Honeypot field - hidden from humans */}
          <div className="hidden" aria-hidden="true">
            <input 
              type="text" 
              name="security_trap" 
              value={honeypot} 
              onChange={(e) => setHoneypot(e.target.value)} 
              tabIndex={-1} 
              autoComplete="off" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-primary/60 ml-1">Identity_ID</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-transparent border border-white/10 rounded-sm py-3 pl-10 pr-4 text-white focus:border-primary outline-none transition-colors font-mono text-sm"
                placeholder="USERNAME"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-primary/60 ml-1">Access_Code</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border border-white/10 rounded-sm py-3 pl-10 pr-4 text-white focus:border-primary outline-none transition-colors font-mono text-sm"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-xs font-mono text-center">{error}</p>}

          <Button type="submit" className="w-full" glow disabled={loading}>
            {loading ? 'AUTHENTICATING...' : 'ACCESS_SYSTEM'}
          </Button>
        </form>
      </div>
    </div>
  );
}
