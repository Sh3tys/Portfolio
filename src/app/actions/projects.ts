'use server';

import { getDb } from '@/lib/mongodb';
import { revalidatePath } from 'next/cache';
import { ObjectId } from 'mongodb';

// Helper to sanitize MongoDB objects for Next.js Client Components
function sanitize(obj: any) {
  if (!obj) return null;
  const serialized = JSON.parse(JSON.stringify(obj));
  // Ensure we have a string 'id' for easier frontend usage
  if (serialized._id) {
    serialized.id = serialized._id;
  }
  return serialized;
}

// --- Projects CRUD ---

export async function getProjects() {
  const db = await getDb();
  const projects = await db.collection('projects').find({}).sort({ createdAt: -1 }).toArray();
  return projects.map(p => sanitize(p));
}

export async function createProject(formData: any) {
  const db = await getDb();
  const result = await db.collection('projects').insertOne({
    ...formData,
    createdAt: new Date(),
  });
  revalidatePath('/');
  revalidatePath('/admin/dashboard');
  return { success: true, id: result.insertedId.toString() };
}

export async function updateProject(id: string, formData: any) {
  const db = await getDb();
  const { id: _, _id, ...updateData } = formData;
  await db.collection('projects').updateOne(
    { _id: new ObjectId(id) },
    { $set: updateData }
  );
  revalidatePath('/');
  revalidatePath('/admin/dashboard');
  return { success: true };
}

export async function deleteProject(id: string) {
  const db = await getDb();
  await db.collection('projects').deleteOne({ _id: new ObjectId(id) });
  revalidatePath('/');
  revalidatePath('/admin/dashboard');
  return { success: true };
}

// --- Skills CRUD ---

export async function getSkills() {
  const db = await getDb();
  const skills = await db.collection('skills').find({}).toArray();
  return skills.map(s => sanitize(s));
}

export async function updateSkillCategory(id: string, category: any) {
  const db = await getDb();
  const { id: _, _id, ...updateData } = category;
  await db.collection('skills').updateOne(
    { _id: new ObjectId(id) },
    { $set: updateData }
  );
  revalidatePath('/');
  revalidatePath('/admin/dashboard');
  return { success: true };
}

// --- Site Content CRUD ---

export async function getSiteContent() {
  const db = await getDb();
  const content = await db.collection('content').findOne({ type: 'global' });
  return sanitize(content);
}

export async function updateSiteContent(content: any) {
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
}
