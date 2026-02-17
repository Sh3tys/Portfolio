'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import {
  Trash2, Edit3, Save, X, Settings, Image as ImageIcon,
  Type, Link as LinkIcon, Hash, Zap, User, Mail,
  Plus, Download, Cpu, Layout, Database, Code, CheckCircle2
} from 'lucide-react';
import {
  updateProject,
  deleteProject,
  updateSkillCategory,
  updateSiteContent,
  createProject
} from '@/app/actions/projects';
import { uploadFile } from '@/app/actions/upload';
import { useRef, useEffect } from 'react';
import { Notification, NotificationType } from '@/components/ui/Notification';

interface Project {
  id: string;
  title: string;
  description: string;
  link?: string;
  image?: string;
  tags: string;
  createdAt: Date;
}

interface SkillCategory {
  id: string;
  name: string;
  skills: string[];
}

interface SiteContent {
  origin: {
    title: string;
    operatorName: string;
    protocol: string;
    description: string[];
    xpYears: string;
    successRate: string;
    image: string;
  };
  contact: {
    email: string;
    cvUrl: string;
    discord: string;
    twitter: string;
    location: string;
  };
}

export default function DashboardClient({
  initialProjects,
  initialSkills,
  initialContent
}: {
  initialProjects: Project[],
  initialSkills: SkillCategory[],
  initialContent: SiteContent
}) {
  const [activeTab, setActiveTab] = useState<'missions' | 'stack' | 'origin' | 'identity'>('missions');
  
  const [projects, setProjects] = useState(initialProjects);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState<Partial<Project>>({});

  const [skills, setSkills] = useState(initialSkills);
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [skillForm, setSkillForm] = useState<Partial<SkillCategory>>({});

  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  const projectImageInputRef = useRef<HTMLInputElement>(null);

  const [notification, setNotification] = useState<{
    isOpen: boolean;
    message: string;
    type: NotificationType;
  }>({
    isOpen: false,
    message: '',
    type: 'success',
  });

  const showNotification = (message: string, type: NotificationType) => {
    setNotification({ isOpen: true, message, type });
  };

  // Handlers
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'cv' | 'project') => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (max 4MB for server actions)
    if (file.size > 4 * 1024 * 1024) {
      showNotification('FILE_LIMIT_EXCEEDED: MAX 4MB REQUIRED', 'error');
      return;
    }

    setIsSaving(true);
    showNotification('UPLOADING_ASSETS...', 'loading');
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await uploadFile(formData);

      if (type === 'image') {
        setContent({ 
          ...content, 
          origin: { ...content.origin, image: res.url } 
        });
      } else if (type === 'cv') {
        setContent({ 
          ...content, 
          contact: { ...content.contact, cvUrl: res.url } 
        });
      } else if (type === 'project') {
        setProjectForm({
          ...projectForm,
          image: res.url
        });
      }
      showNotification('UPLOAD_COMPLETE: ASSET_STREAM_STABLE', 'success');
    } catch (error) {
      console.error('Upload failed:', error);
      showNotification('UPLOAD_FAILED: PROTOCOL_CORRUPTION', 'error');
    } finally {
      setIsSaving(false);
    }
  };
  const handleEditProject = (project: Project) => {
    setEditingProjectId(project.id);
    setProjectForm(project);
  };

  const handleSaveProject = async () => {
    setIsSaving(true);
    showNotification('SYNCING_DATABASE...', 'loading');
    try {
      await updateProject(editingProjectId!, projectForm);
      setProjects(projects.map(p => p.id === editingProjectId ? { ...p, ...projectForm } as Project : p));
      setEditingProjectId(null);
      showNotification('MISSION_UPDATED: DATA_INTEGRITY_VERIFIED', 'success');
    } catch (error) {
      showNotification('SYNC_FAILED: ACCESS_DENIED', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSkill = async () => {
    setIsSaving(true);
    showNotification('SYNCING_STACK...', 'loading');
    try {
      await updateSkillCategory(editingSkillId!, skillForm);
      setSkills(skills.map(s => s.id === editingSkillId ? { ...s, ...skillForm } as SkillCategory : s));
      setEditingSkillId(null);
      showNotification('STACK_UPDATED: ARSENAL_STABLE', 'success');
    } catch (error) {
      showNotification('SYNC_FAILED: PROTOCOL_ERROR', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveContent = async () => {
    setIsSaving(true);
    showNotification('COMMITTING_CHANGES...', 'loading');
    try {
      await updateSiteContent(content);
      showNotification('DEPLOYMENT_SUCCESSFUL: ORIGIN_NODES_UPDATED', 'success');
    } catch (error) {
      showNotification('DEPLOYMENT_FAILED: SIGNAL_LOST', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    setIsSaving(true);
    showNotification('PURGING_ENTRY...', 'loading');
    try {
      await deleteProject(id);
      setProjects(projects.filter(p => p.id !== id));
      showNotification('ENTRY_PURGED: DATA_VOIDED', 'success');
    } catch (error) {
      showNotification('PURGE_FAILED: ENTRY_PROTECTED', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateProject = async () => {
    const newProject = {
      title: 'NEW_MISSION',
      description: 'Mission description required...',
      tags: 'Protocol, System',
    };
    const res = await createProject(newProject);
    if (res.success) {
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8">
      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/5 pb-4">
        {[
          { id: 'missions', label: 'ACTIVE_MISSIONS', icon: Layout },
          { id: 'stack', label: 'TECHNICAL_STACK', icon: Cpu },
          { id: 'origin', label: 'MISSION_ORIGIN', icon: User },
          { id: 'identity', label: 'ESTABLISH_SIGNAL', icon: Mail },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 font-mono text-xs uppercase tracking-widest transition-all ${
              activeTab === tab.id
                ? 'bg-primary text-background'
                : 'text-foreground/40 hover:text-primary hover:bg-white/5'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[500px]">
        {activeTab === 'missions' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold font-mono text-primary">PROJECT_DATABASE</h2>
              <Button size="sm" variant="outline" className="gap-2" onClick={handleCreateProject}>
                <Plus className="w-4 h-4" /> ADD_NEW_ENTRY
              </Button>
            </div>
            <div className="grid gap-4">
              {projects.map(project => (
                <div key={project.id} className="glass p-6 border-l-2 border-primary/20 hover:border-primary transition-all group">
                  {editingProjectId === project.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <input className="bg-black/50 border border-white/10 p-2 font-mono text-xs text-white outline-none" value={projectForm.title} onChange={e => setProjectForm({...projectForm, title: e.target.value})} />
                        <input className="bg-black/50 border border-white/10 p-2 font-mono text-xs text-white outline-none" value={projectForm.tags} onChange={e => setProjectForm({...projectForm, tags: e.target.value})} />
                      </div>
                      <div className="flex gap-4 items-center">
                        <div className="w-16 h-10 bg-white/5 border border-white/10 rounded flex items-center justify-center overflow-hidden">
                          {projectForm.image ? (
                            <img src={projectForm.image} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-4 h-4 text-white/20" />
                          )}
                        </div>
                        <input 
                          type="file" 
                          ref={projectImageInputRef} 
                          className="hidden" 
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'project')}
                        />
                        <Button size="sm" variant="outline" onClick={() => projectImageInputRef.current?.click()}>
                          CHANGE_IMAGE
                        </Button>
                      </div>
                      <textarea className="w-full bg-black/50 border border-white/10 p-2 font-mono text-xs text-white outline-none h-24" value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} />
                       <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => setEditingProjectId(null)}>
                            <X className="w-4 h-4" />
                          </Button>
                          <Button variant="primary" size="sm" onClick={handleSaveProject} disabled={isSaving}>
                            <Save className="w-4 h-4 mr-2" /> {isSaving ? 'SYNCING...' : 'COMMIT'}
                          </Button>
                       </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-sm uppercase">{project.title}</p>
                        <p className="text-[10px] text-foreground/40 font-mono italic">
                          {project.tags}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="outline" size="sm" onClick={() => handleEditProject(project)}>
                          <Edit3 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500/50 hover:text-red-500 hover:bg-red-500/10"
                          onClick={() => handleDeleteProject(project.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'stack' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h2 className="text-xl font-bold font-mono text-secondary">CAPABILITY_ARSENAL</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {skills.map(category => (
                <div key={category.id} className="glass p-6 border-t-2 border-secondary/20">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-mono font-bold text-secondary uppercase tracking-widest">{category.name}</h3>
                    <div className="flex justify-end gap-2">
                      {editingSkillId === category.id && (
                        <Button size="sm" variant="primary" onClick={handleSaveSkill} disabled={isSaving}>
                          <Save className="w-4 h-4 mr-2" /> {isSaving ? 'SYNCING...' : 'SAVE'}
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => { setEditingSkillId(category.id); setSkillForm(category); }}><Edit3 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map(skill => (
                      <span key={skill} className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-mono border border-white/10 uppercase">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'origin' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-4xl">
            <h2 className="text-xl font-bold font-mono text-accent">ORIGIN_PARAMETERS</h2>
            <div className="glass p-8 space-y-8 border border-white/5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="aspect-square bg-white/5 border border-dashed border-white/10 rounded-sm flex flex-col items-center justify-center group relative overflow-hidden">
                    {content.origin.image ? (
                      <div className="text-center p-4 w-full h-full relative">
                         <img 
                           src={content.origin.image} 
                           alt="Profile" 
                           className="w-full h-full object-cover rounded-sm opacity-50 group-hover:opacity-100 transition-opacity"
                         />
                         <div className="absolute bottom-4 left-0 right-0">
                            <p className="text-[10px] font-mono text-white/80 uppercase bg-black/40 backdrop-blur-sm py-1 px-2 inline-block">FACE_SCAN_ACTIVE</p>
                         </div>
                      </div>
                    ) : (
                      <ImageIcon className="w-12 h-12 text-white/10 group-hover:text-primary transition-colors" />
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                       <input 
                         type="file" 
                         ref={profileInputRef} 
                         className="hidden" 
                         accept="image/*"
                         onChange={(e) => handleFileUpload(e, 'image')}
                       />
                       <Button size="sm" onClick={() => profileInputRef.current?.click()}>UPLOAD_IMAGE</Button>
                    </div>
                  </div>
                  <input className="w-full bg-black/50 border border-white/10 p-3 font-mono text-xs text-primary outline-none" placeholder="NAME" value={content.origin.operatorName} onChange={e => setContent({...content, origin: {...content.origin, operatorName: e.target.value}})} />
                </div>
                <div className="space-y-6">
                   <div className="space-y-2">
                     <label className="text-[10px] font-mono text-white/20 uppercase">Core_Protocol</label>
                     <input className="w-full bg-black/50 border border-white/10 p-3 font-mono text-xs text-white outline-none" value={content.origin.protocol} onChange={e => setContent({...content, origin: {...content.origin, protocol: e.target.value}})} />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono text-white/20 uppercase">XP_Level</label>
                        <input className="w-full bg-black/50 border border-white/10 p-3 font-mono text-xs text-white outline-none" value={content.origin.xpYears} onChange={e => setContent({...content, origin: {...content.origin, xpYears: e.target.value}})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono text-white/20 uppercase">Success_Rate</label>
                        <input className="w-full bg-black/50 border border-white/10 p-3 font-mono text-xs text-white outline-none" value={content.origin.successRate} onChange={e => setContent({...content, origin: {...content.origin, successRate: e.target.value}})} />
                      </div>
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-mono text-white/20 uppercase">History_Log</label>
                     <textarea className="w-full bg-black/50 border border-white/10 p-3 font-mono text-xs text-white/60 h-32 outline-none" value={content.origin.description.join('\n\n')} onChange={e => setContent({...content, origin: {...content.origin, description: e.target.value.split('\n\n')}})} />
                   </div>
                </div>
              </div>
              <div className="flex justify-end pt-4 border-t border-white/5">
                 <Button glow onClick={handleSaveContent} disabled={isSaving}>
                    {isSaving ? 'UPLOADING...' : 'SAVE_IDENTITY_PARAMETERS'}
                 </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'identity' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-4xl">
            <h2 className="text-xl font-bold font-mono text-white/80 uppercase">SIGNAL_PROTOCOLS</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass p-6 space-y-6">
                 <h3 className="text-xs font-mono text-white/30 uppercase mb-4 border-b border-white/5 pb-2">Communications</h3>
                 <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-white/20 uppercase flex items-center gap-2"><Mail className="w-3 h-3"/> Main_Signal</label>
                      <input className="w-full bg-black/50 border border-white/10 p-3 font-mono text-xs text-white outline-none" value={content.contact.email} onChange={e => setContent({...content, contact: {...content.contact, email: e.target.value}})} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-white/20 uppercase flex items-center gap-2"><LinkIcon className="w-3 h-3"/> Discord_Socket</label>
                      <input className="w-full bg-black/50 border border-white/10 p-3 font-mono text-xs text-white outline-none" value={content.contact.discord} onChange={e => setContent({...content, contact: {...content.contact, discord: e.target.value}})} />
                    </div>
                 </div>
              </div>

              <div className="glass p-6 space-y-6">
                 <h3 className="text-xs font-mono text-white/30 uppercase mb-4 border-b border-white/5 pb-2">Asset Management</h3>
                 <div className="space-y-4">
                    <div className="p-4 border border-dashed border-white/10 rounded-sm text-center group hover:border-primary/40 transition-colors">
                       <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Download className="w-5 h-5 text-primary" />
                       </div>
                       <p className="text-[10px] font-mono text-white/60 mb-1 uppercase tracking-tighter">Current_CV: {content.contact.cvUrl.split('/').pop() || 'OPERATOR_CORE.PDF'}</p>
                       <p className="text-[9px] font-mono text-white/20 mb-4">Storage: {content.contact.cvUrl.startsWith('/') ? 'LOCAL_NODE' : 'EXTERNAL'}</p>
                       <input 
                         type="file" 
                         ref={cvInputRef} 
                         className="hidden" 
                         accept=".pdf,.doc,.docx"
                         onChange={(e) => handleFileUpload(e, 'cv')}
                       />
                       <Button size="sm" variant="outline" className="w-full" onClick={() => cvInputRef.current?.click()}>UPDATE_CV_ASSET</Button>
                    </div>
                 </div>
              </div>
            </div>
            <div className="flex justify-between items-center glass p-4 font-mono text-[10px] text-white/20 italic">
               <p>// Changes will bypass CDN and propagate immediately to origin nodes.</p>
               <Button size="sm" glow onClick={handleSaveContent} disabled={isSaving}>
                  {isSaving ? 'COMMITTING...' : 'DEPLOY_CHANGES'}
               </Button>
            </div>
          </div>
        )}
      </div>

      <Notification 
        {...notification} 
        onClose={() => setNotification({ ...notification, isOpen: false })} 
      />
    </div>
  );
}
