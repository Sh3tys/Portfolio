'use server';

import { getDb } from '@/lib/mongodb';
import { revalidatePath } from 'next/cache';
import { ObjectId } from 'mongodb';

export interface ActionResponse {
  success: boolean;
  id?: string;
  error?: string;
}

// Helper to sanitize MongoDB objects for Next.js Client Components
function sanitize(obj: any) {
  if (!obj) return null;
  const serialized = JSON.parse(JSON.stringify(obj));
  if (serialized._id) {
    serialized.id = serialized._id;
  }
  return serialized;
}

// --- Projects CRUD ---

export async function getProjects(): Promise<any[]> {
  try {
    const db = await getDb();
    const projects = await db.collection('projects').find({}).sort({ createdAt: -1 }).toArray();
    return projects.map((p: any) => sanitize(p));
  } catch (error) {
    console.error('getProjects error:', error);
    return [];
  }
}

export async function createProject(formData: any): Promise<ActionResponse> {
  try {
    const db = await getDb();
    const result = await db.collection('projects').insertOne({
      ...formData,
      createdAt: new Date(),
    });
    revalidatePath('/');
    revalidatePath('/admin/dashboard');
    return { success: true, id: result.insertedId.toString() };
  } catch (error: any) {
    console.error('Create Project Error:', error);
    return { success: false, error: error.message || 'Unknown database error' };
  }
}

export async function updateProject(id: string, formData: any): Promise<ActionResponse> {
  try {
    const db = await getDb();
    const { id: _, _id, ...updateData } = formData;
    await db.collection('projects').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    revalidatePath('/');
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (error: any) {
    console.error('Update Project Error:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteProject(id: string): Promise<ActionResponse> {
  try {
    const db = await getDb();
    await db.collection('projects').deleteOne({ _id: new ObjectId(id) });
    revalidatePath('/');
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (error: any) {
    console.error('Delete Project Error:', error);
    return { success: false, error: error.message };
  }
}

// --- Skills CRUD ---

export async function getSkills(): Promise<any[]> {
  try {
    const db = await getDb();
    const skills = await db.collection('skills').find({}).toArray();
    return skills.map((s: any) => sanitize(s));
  } catch (error) {
    console.error('getSkills error:', error);
    return [];
  }
}

export async function updateSkillCategory(id: string, category: any): Promise<ActionResponse> {
  try {
    const db = await getDb();
    const { id: _, _id, ...updateData } = category;
    await db.collection('skills').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    revalidatePath('/');
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (error: any) {
    console.error('Update Skill Error:', error);
    return { success: false, error: error.message };
  }
}

// --- Site Content CRUD ---

export async function getSiteContent(): Promise<any> {
  try {
    const db = await getDb();
    const content = await db.collection('content').findOne({ type: 'global' });
    return sanitize(content);
  } catch (error) {
    console.error('getSiteContent error:', error);
    return null;
  }
}

export async function updateSiteContent(content: any): Promise<ActionResponse> {
  try {
    const db = await getDb();
    const { _id, ...updateData } = content;
    await db.collection('content').updateOne(
      { type: 'global' },
      { $set: updateData },
      { upsert: true }
    );
    revalidatePath('/');
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (error: any) {
    console.error('Update Content Error:', error);
    return { success: false, error: error.message };
  }
}
