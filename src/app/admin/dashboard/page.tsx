import { 
  getProjects, 
  getSkills, 
  getSiteContent 
} from '@/app/actions/projects';
import { staticProjects, staticSkills, staticSiteContent } from '@/data/projects';
import { getServerSession } from 'next-auth';
import LogoutButton from '@/components/admin/LogoutButton';
import DashboardClient from './DashboardClient';
import { Terminal } from 'lucide-react';

export default async function AdminDashboard() {
  const session = await getServerSession();
  
  // Try to fetch from DB, fallback to static if empty or seed on first run
  let projects = await getProjects();
  let skills = await getSkills();
  let content = await getSiteContent();

  if (projects.length === 0) projects = staticProjects as any;
  if (skills.length === 0) skills = staticSkills as any;
  if (!content) content = staticSiteContent as any;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Sidebar-ish Top Nav */}
      <nav className="border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Terminal className="w-6 h-6 text-primary" />
            <span className="font-mono text-lg font-bold">CONTROL_CENTER_v4</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-xs font-mono text-foreground/40 hidden md:block">
              AUTH_LEVEL: ROOT // {session?.user?.name}
            </span>
            <LogoutButton />
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12">
        <header className="mb-12">
          <h1 className="text-4xl font-bold tracking-tighter mb-2 italic">DASHBOARD_OVERVIEW</h1>
          <p className="text-foreground/40 font-mono text-sm leading-relaxed uppercase tracking-widest">
            Welcome back, Operator. All site systems are initialized for modification.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Quick Stats */}
          <div className="glass p-6 rounded-sm border-l-2 border-l-primary">
            <h3 className="text-xs font-mono text-primary/60 uppercase mb-4">Total Missions</h3>
            <p className="text-5xl font-bold tracking-tighter">{projects.length}</p>
          </div>
          <div className="glass p-6 rounded-sm border-l-2 border-l-secondary">
            <h3 className="text-xs font-mono text-secondary/60 uppercase mb-4">Storage Mode</h3>
            <p className="text-5xl font-bold tracking-tighter uppercase tracking-tighter">ATLAS_DB</p>
          </div>
          <div className="glass p-6 rounded-sm border-l-2 border-l-accent">
            <h3 className="text-xs font-mono text-accent/60 uppercase mb-4">System Health</h3>
            <p className="text-5xl font-bold tracking-tighter italic">ONLINE</p>
          </div>
        </div>

        <DashboardClient 
          initialProjects={projects} 
          initialSkills={skills} 
          initialContent={content} 
        />
      </main>
    </div>
  );
}
