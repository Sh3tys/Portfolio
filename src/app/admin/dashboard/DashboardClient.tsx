'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import {
  Trash2, Edit3, Save, X, Settings, Image as ImageIcon,
  Type, Link as LinkIcon, Hash, Zap, User, Mail, Shield,
  Plus, Download, Cpu, Layout, Database, Code, CheckCircle2
} from 'lucide-react';
import {
  updateProject,
  deleteProject,
  updateSkillCategory,
  updateSiteContent,
  createProject,
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience
} from '@/app/actions/projects';
import { uploadFile } from '@/app/actions/upload';
import { useRef, useEffect } from 'react';
import { Notification, NotificationType } from '@/components/ui/Notification';
import { Experience } from '@/data/projects';

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
  initialContent,
  initialExperiences
}: {
  initialProjects: Project[],
  initialSkills: SkillCategory[],
  initialContent: SiteContent,
  initialExperiences: Experience[]
}) {
  const [activeTab, setActiveTab] = useState<'missions' | 'stack' | 'experience' | 'origin' | 'identity'>('missions');
  
  const [projects, setProjects] = useState(initialProjects);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState<Partial<Project>>({});

  const [skills, setSkills] = useState(initialSkills);
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [skillForm, setSkillForm] = useState<Partial<SkillCategory>>({});

  const [experiences, setExperiences] = useState(initialExperiences);
  const [editingExperienceId, setEditingExperienceId] = useState<string | null>(null);
  const [experienceForm, setExperienceForm] = useState<Partial<Experience>>({});

  const experienceImageInputRef = useRef<HTMLInputElement>(null);

  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  const projectImageInputRef = useRef<HTMLInputElement>(null);

  // Helper function to resize/compress images before upload
  const resizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDimension = 1200;

          if (width > height && width > maxDimension) {
            height = (height * maxDimension) / width;
            width = maxDimension;
          } else if (height > maxDimension) {
            width = (width * maxDimension) / height;
            height = maxDimension;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

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

    setIsSaving(true);
    showNotification('UPLOADING_ASSETS...', 'loading');
    
    try {
      let finalUrl = '';
      
      if (type === 'image' || type === 'project') {
        showNotification('OPTIMIZING_IMAGE...', 'loading');
        finalUrl = await resizeImage(file);
      } else {
        const formData = new FormData();
        formData.append('file', file);
        const res = await uploadFile(formData);
        finalUrl = res.url;
      }

      if (type === 'image') {
        setContent({ 
          ...content, 
          origin: { ...content.origin, image: finalUrl } 
        });
      } else if (type === 'cv') {
        setContent({ 
          ...content, 
          contact: { ...content.contact, cvUrl: finalUrl } 
        });
      } else if (type === 'project') {
        setProjectForm({
          ...projectForm,
          image: finalUrl
        });
      }
      showNotification('UPLOAD_COMPLETE: ASSET_STREAM_STABLE', 'success');
    } catch (error) {
      console.error('[UPLOAD_ERROR]', error);
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
      const res = await updateProject(editingProjectId!, projectForm);
      if (res.success) {
        setProjects(projects.map(p => p.id === editingProjectId ? { ...p, ...projectForm } as Project : p));
        setEditingProjectId(null);
        showNotification('MISSION_UPDATED: DATA_INTEGRITY_VERIFIED', 'success');
      } else {
        showNotification(`SYNC_FAILED: ${res.error || 'ACCESS_DENIED'}`, 'error');
      }
    } catch (error) {
      console.error('[PROJECT_SAVE_ERROR]', error);
      showNotification('SYNC_FAILED: ACCESS_DENIED', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSkill = async () => {
    setIsSaving(true);
    showNotification('SYNCING_STACK...', 'loading');
    try {
      const res = await updateSkillCategory(editingSkillId!, skillForm);
      if (res.success) {
        setSkills(skills.map(s => s.id === editingSkillId ? { ...s, ...skillForm } as SkillCategory : s));
        setEditingSkillId(null);
        showNotification('STACK_UPDATED: ARSENAL_STABLE', 'success');
      } else {
        showNotification(`SYNC_FAILED: ${res.error || 'PROTOCOL_ERROR'}`, 'error');
      }
    } catch (error) {
      console.error('[SKILL_SAVE_ERROR]', error);
      showNotification('SYNC_FAILED: PROTOCOL_ERROR', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveContent = async () => {
    setIsSaving(true);
    showNotification('COMMITTING_CHANGES...', 'loading');
    try {
      const res = await updateSiteContent(content);
      if (res.success) {
        showNotification('DEPLOYMENT_SUCCESSFUL: ORIGIN_NODES_UPDATED', 'success');
      } else {
        showNotification(`DEPLOYMENT_FAILED: ${res.error || 'SIGNAL_LOST'}`, 'error');
      }
    } catch (error) {
      console.error('[CONTENT_DEPLOY_ERROR]', error);
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

  const handleEditExperience = (exp: Experience) => {
    setEditingExperienceId(exp.id);
    setExperienceForm(exp);
  };

  const handleSaveExperience = async () => {
    setIsSaving(true);
    showNotification('SYNCING_EXPERIENCE_LOG...', 'loading');
    try {
      let res;
      if (editingExperienceId === 'new') {
        res = await createExperience(experienceForm);
        if (res.success) {
          setExperiences([...experiences, { ...experienceForm, id: res.id } as Experience]);
          setEditingExperienceId(null);
          showNotification('MISSION_EXPERIENCE_LOGGED', 'success');
        }
      } else {
        res = await updateExperience(editingExperienceId!, experienceForm);
        if (res.success) {
          setExperiences(experiences.map(e => e.id === editingExperienceId ? { ...e, ...experienceForm } as Experience : e));
          setEditingExperienceId(null);
          showNotification('MISSION_EXPERIENCE_UPDATED', 'success');
        }
      }
      if (!res?.success) {
        showNotification(`SYNC_FAILED: ${res?.error || 'PROTOCOL_CORRUPTION'}`, 'error');
      }
    } catch (error) {
      console.error('[EXPERIENCE_SAVE_ERROR]', error);
      showNotification('SYNC_FAILED: ACCESS_DENIED', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteExperience = async (id: string) => {
    if (!confirm('TERMINATE_EXPERIENCE_LOG?')) return;
    setIsSaving(true);
    try {
      const res = await deleteExperience(id);
      if (res.success) {
        setExperiences(experiences.filter(e => e.id !== id));
        showNotification('LOG_TERMINATED', 'success');
      }
    } catch (error) {
      showNotification('SIGNAL_LOST', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateExperience = () => {
    setEditingExperienceId('new');
    setExperienceForm({ company: '', role: '', duration: '', description: '', order: experiences.length + 1 });
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
        <div className="flex flex-col gap-4">
          <button
            onClick={() => setActiveTab('missions')}
            className={`flex items-center gap-3 px-4 py-3 rounded-sm transition-all duration-300 font-mono text-xs uppercase tracking-widest ${
              activeTab === 'missions' ? 'bg-primary/20 text-primary border-r-2 border-primary' : 'text-foreground/40 hover:bg-white/5'
            }`}
          >
            <Layout className="w-4 h-4" /> Missions_Log
          </button>
          <button
            onClick={() => setActiveTab('stack')}
            className={`flex items-center gap-3 px-4 py-3 rounded-sm transition-all duration-300 font-mono text-xs uppercase tracking-widest ${
              activeTab === 'stack' ? 'bg-secondary/20 text-secondary border-r-2 border-secondary' : 'text-foreground/40 hover:bg-white/5'
            }`}
          >
            <Cpu className="w-4 h-4" /> capability_arsenal
          </button>
          <button
            onClick={() => setActiveTab('experience')}
            className={`flex items-center gap-3 px-4 py-3 rounded-sm transition-all duration-300 font-mono text-xs uppercase tracking-widest ${
              activeTab === 'experience' ? 'bg-orange-500/20 text-orange-500 border-r-2 border-orange-500' : 'text-foreground/40 hover:bg-white/5'
            }`}
          >
            <Database className="w-4 h-4" /> mission_history
          </button>
          <button
            onClick={() => setActiveTab('origin')}
            className={`flex items-center gap-3 px-4 py-3 rounded-sm transition-all duration-300 font-mono text-xs uppercase tracking-widest ${
              activeTab === 'origin' ? 'bg-accent/20 text-accent border-r-2 border-accent' : 'text-foreground/40 hover:bg-white/5'
            }`}
          >
            <Type className="w-4 h-4" /> Origin_Params
          </button>
          <button
            onClick={() => setActiveTab('identity')}
            className={`flex items-center gap-3 px-4 py-3 rounded-sm transition-all duration-300 font-mono text-xs uppercase tracking-widest ${
              activeTab === 'identity' ? 'bg-white/10 text-white border-r-2 border-white' : 'text-foreground/40 hover:bg-white/5'
            }`}
          >
            <Shield className="w-4 h-4" /> signal_protocols
          </button>
        </div>
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
                      <Button size="sm" variant="ghost" onClick={() => { 
                        if (editingSkillId === category.id) {
                          setEditingSkillId(null);
                        } else {
                          setEditingSkillId(category.id); 
                          setSkillForm(category); 
                        }
                      }}>
                        {editingSkillId === category.id ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  {editingSkillId === category.id ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-mono text-white/20 uppercase mb-2 block">Skill_Protocol_Stream (Comma Separated)</label>
                        <textarea 
                          className="w-full bg-black/50 border border-white/10 p-3 font-mono text-xs text-secondary outline-none h-24"
                          value={skillForm.skills?.join(', ')}
                          onChange={e => setSkillForm({...skillForm, skills: e.target.value.split(',').map(s => s.trim())})}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {category.skills.map(skill => (
                        <span key={skill} className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-mono border border-white/10 uppercase">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'experience' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold font-mono text-orange-500 uppercase tracking-tighter">MISSION_HISTORY</h2>
              <Button size="sm" onClick={handleCreateExperience} disabled={editingExperienceId !== null}>
                <Plus className="w-4 h-4 mr-2" /> INJECT_HISTORY
              </Button>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {editingExperienceId && (
                <div className="glass p-8 border-l-4 border-l-orange-500 space-y-6">
                  <div className="flex justify-between items-center border-b border-white/5 pb-4">
                    <h3 className="font-mono text-lg uppercase tracking-tighter text-orange-400">
                      {editingExperienceId === 'new' ? 'NEW_EXPERIENCE_PROTOCOL' : 'UPDATE_EXPERIENCE_LOG'}
                    </h3>
                    <Button variant="ghost" size="sm" onClick={() => setEditingExperienceId(null)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="aspect-square bg-white/5 border border-dashed border-white/10 rounded-sm flex flex-col items-center justify-center group relative overflow-hidden">
                        {experienceForm.image ? (
                          <div className="w-full h-full relative p-4">
                             <img 
                               src={experienceForm.image} 
                               alt="Logo" 
                               className="w-full h-full object-contain"
                             />
                             <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <Button size="sm" onClick={() => experienceImageInputRef.current?.click()}>CHANGE_LOGO</Button>
                             </div>
                          </div>
                        ) : (
                          <div className="text-center p-4">
                            <ImageIcon className="w-12 h-12 text-white/10 mb-4 mx-auto" />
                            <Button size="sm" onClick={() => experienceImageInputRef.current?.click()}>UPLOAD_LOGO</Button>
                          </div>
                        )}
                        <input 
                          type="file" 
                          ref={experienceImageInputRef} 
                          className="hidden" 
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              showNotification('OPTIMIZING_LOGO...', 'loading');
                              const url = await resizeImage(file);
                              setExperienceForm({...experienceForm, image: url});
                              showNotification('LOGO_OPTIMIZED', 'success');
                            }
                          }}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-mono text-white/20 uppercase">COMPANY</label>
                          <input className="w-full bg-black/50 border border-white/10 p-3 font-mono text-xs text-white outline-none focus:border-orange-500/50" value={experienceForm.company} onChange={e => setExperienceForm({...experienceForm, company: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-mono text-white/20 uppercase">ROLE</label>
                          <input className="w-full bg-black/50 border border-white/10 p-3 font-mono text-xs text-white outline-none focus:border-orange-500/50" value={experienceForm.role} onChange={e => setExperienceForm({...experienceForm, role: e.target.value})} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-mono text-white/20 uppercase">DURATION</label>
                          <input className="w-full bg-black/50 border border-white/10 p-3 font-mono text-xs text-white outline-none focus:border-orange-500/50" placeholder="e.g. 2022 - 2024" value={experienceForm.duration} onChange={e => setExperienceForm({...experienceForm, duration: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-mono text-white/20 uppercase">COMP_LINK</label>
                          <input className="w-full bg-black/50 border border-white/10 p-3 font-mono text-xs text-white outline-none focus:border-orange-500/50" value={experienceForm.link} onChange={e => setExperienceForm({...experienceForm, link: e.target.value})} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono text-white/20 uppercase">DESCRIPTION</label>
                        <textarea className="w-full bg-black/50 border border-white/10 p-3 font-mono text-xs text-white/60 h-32 outline-none focus:border-orange-500/50" value={experienceForm.description} onChange={e => setExperienceForm({...experienceForm, description: e.target.value})} />
                      </div>
                      <div className="flex justify-end gap-4 pt-4">
                        <Button variant="ghost" onClick={() => setEditingExperienceId(null)}>CANCEL</Button>
                        <Button glow onClick={handleSaveExperience} disabled={isSaving}>
                          {isSaving ? 'SYNCING...' : 'SAVE_EXPERIENCE'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="relative space-y-8 pl-8 border-l border-white/10 ml-4">
                {experiences.length === 0 && (
                  <div className="text-center py-12 text-white/20 font-mono text-sm uppercase italic">
                    No mission history logged. Initiate first entry.
                  </div>
                )}
                {experiences.map((exp, index) => (
                  <div key={exp.id} className="relative group animate-in slide-in-from-right-4 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                    {/* Timeline Node */}
                    <div className="absolute -left-[42px] top-6 w-5 h-5 rounded-full bg-black border-2 border-orange-500/50 z-10 group-hover:bg-orange-500 group-hover:border-orange-500 transition-all duration-300 shadow-[0_0_0_rgba(249,115,22,0)] group-hover:shadow-[0_0_15px_rgba(249,115,22,0.6)] flex items-center justify-center">
                       <div className="w-1.5 h-1.5 rounded-full bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    
                    {/* Content Card */}
                    <div className="glass p-6 border border-white/5 hover:border-orange-500/50 transition-all duration-300 relative overflow-hidden group-hover:translate-x-2">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                      
                      <div className="flex flex-col md:flex-row gap-6 relative z-10">
                        <div className="w-16 h-16 rounded-md bg-white/5 flex-shrink-0 flex items-center justify-center p-2 border border-white/10 group-hover:border-orange-500/30 transition-colors">
                          {exp.image ? (
                            <img src={exp.image} alt={exp.company} className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500" />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-white/10 group-hover:text-orange-500 transition-colors" />
                          )}
                        </div>
                        
                        <div className="flex-grow space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-lg uppercase tracking-tight text-white group-hover:text-orange-400 transition-colors">{exp.company}</h4>
                              <p className="text-xs font-mono text-orange-500/80 uppercase tracking-widest mb-1">{exp.role}</p>
                              <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/5 text-[10px] font-mono text-white/40 border border-white/5 group-hover:border-orange-500/20 transition-colors">
                                {exp.duration}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                              <Button variant="outline" size="sm" onClick={() => handleEditExperience(exp)} className="hover:bg-orange-500/10 hover:text-orange-500 border-white/10">
                                <Edit3 className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500/50 hover:text-red-500 hover:bg-red-500/10"
                                onClick={() => handleDeleteExperience(exp.id)}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                          
                          <p className="text-sm text-white/60 font-light leading-relaxed max-w-2xl group-hover:text-white/80 transition-colors">
                            {exp.description}
                          </p>
                          
                          {exp.link && (
                            <a href={exp.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[10px] font-mono uppercase text-white/30 hover:text-orange-400 transition-colors mt-2">
                              <LinkIcon className="w-3 h-3" /> External_Link
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}


        {activeTab === 'origin' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-4xl">
            <h2 className="text-xl font-bold font-mono text-accent">ORIGIN_PARAMETERS</h2>
            <div className="glass p-8 space-y-8 border border-white/5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="w-[300px] h-[300px] md:w-[380px] md:h-[380px] relative flex items-center justify-center mx-auto group">
                    {/* HUD Rings (Matching page.tsx) */}
                    <div className="absolute inset-0 rounded-full border border-primary/20 animate-[spin_20s_linear_infinite]" />
                    <div className="absolute inset-4 rounded-full border border-dashed border-primary/30 animate-[spin_15s_linear_infinite_reverse]" />
                    
                    {/* Preview Container */}
                    <div className="w-[260px] h-[260px] md:w-[320px] md:h-[320px] rounded-full overflow-hidden relative z-10 border-2 border-primary/40 bg-black/50 shadow-[0_0_40px_rgba(0,242,255,0.1)]">
                      {content.origin.image ? (
                        <div className="w-full h-full relative">
                           <img 
                             src={content.origin.image} 
                             alt="Profile" 
                             className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700"
                           />
                           {/* Overlay when hovering */}
                           <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all duration-300 z-20">
                              <p className="font-mono text-[10px] text-primary mb-4 uppercase tracking-widest">Update_Signal</p>
                              <Button size="sm" onClick={() => profileInputRef.current?.click()}>INJECT_NEW_ASSET</Button>
                           </div>
                           
                           {/* Scanning Line HUD Effect */}
                           <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,242,255,0.05)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] animate-pulse" />
                        </div>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                          <ImageIcon className="w-16 h-16 text-white/10 mb-4" />
                          <Button size="sm" onClick={() => profileInputRef.current?.click()}>UPLOAD_DATA</Button>
                        </div>
                      )}
                    </div>

                    {/* Corner Markers */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-primary/50" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-primary/50" />
                    
                    <input 
                      type="file" 
                      ref={profileInputRef} 
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'image')}
                    />
                  </div>
                  <div className="max-w-[380px] mx-auto text-center">
                    <p className="text-[10px] font-mono text-primary/40 uppercase mb-4 italic">// ACTIVE_IDENTITY_PREVIEW_v4.2</p>
                    <input className="w-full bg-black/50 border border-white/10 p-4 font-mono text-sm text-primary outline-none text-center rounded-sm focus:border-primary/50 transition-colors" placeholder="OPERATOR_NAME" value={content.origin.operatorName} onChange={e => setContent({...content, origin: {...content.origin, operatorName: e.target.value}})} />
                  </div>
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
