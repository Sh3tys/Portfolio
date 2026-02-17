'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, Save, Globe, Image as ImageIcon, Type, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';
import { createProject } from '@/app/actions/projects';

export default function NewProject() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    image: '',
    tags: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await createProject(formData);
    
    if (result.success) {
      router.push('/admin/dashboard');
    } else {
      alert('Error: ' + (result.error || 'Unknown database error'));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="p-2 glass hover:text-primary transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold font-mono uppercase tracking-tighter">Initialize_Project</h1>
          </div>
          <Button onClick={handleSubmit} glow className="gap-2" disabled={loading}>
            <Save className="w-4 h-4" /> {loading ? 'COMMITTING...' : 'COMMIT_CHANGES'}
          </Button>
        </header>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-12" onSubmit={handleSubmit}>
          <div className="space-y-8">
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-primary/60 flex items-center gap-2">
                <Type className="w-3 h-3" /> Project_Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-transparent border-b border-white/10 py-3 focus:border-primary outline-none transition-colors font-mono text-lg"
                placeholder="ENTER_NAME..."
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-primary/60 flex items-center gap-2">
                <Globe className="w-3 h-3" /> Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-transparent border border-white/10 p-4 min-h-[150px] focus:border-primary outline-none transition-colors font-mono text-sm leading-relaxed"
                placeholder="MISSION_DETAILS..."
                required
              />
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-primary/60 flex items-center gap-2">
                <LinkIcon className="w-3 h-3" /> Deployment_Link
              </label>
              <input
                type="text"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                className="w-full bg-transparent border-b border-white/10 py-3 focus:border-primary outline-none transition-colors font-mono text-sm"
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-primary/60 flex items-center gap-2">
                <ImageIcon className="w-3 h-3" /> Asset_URL
              </label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full bg-transparent border-b border-white/10 py-3 focus:border-primary outline-none transition-colors font-mono text-sm"
                placeholder="/assets/missions/..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-primary/60">Skills_Tags</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full bg-transparent border-b border-white/10 py-3 focus:border-primary outline-none transition-colors font-mono text-sm uppercase"
                placeholder="NEXTJS, REACT, THREEJS..."
                required
              />
            </div>
          </div>
        </form>
        
        <div className="mt-16 p-8 glass border border-primary/10 rounded-sm italic text-foreground/20 text-[10px] font-mono uppercase tracking-[0.3em] text-center">
          Terminal Status: Ready for input // Data encryption active
        </div>
      </div>
    </div>
  );
}
