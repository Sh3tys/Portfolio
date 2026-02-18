'use server';

import { getDb } from '@/lib/mongodb';
import { revalidatePath } from 'next/cache';
import { ObjectId } from 'mongodb';

export interface ActionResponse {
  success: boolean;
  id?: string;
  error?: string;
}

// Enhanced security sanitization system
function sanitize(obj: any) {
  if (!obj) return null;
  
  // Prevent NoSQL Injection and sanitize all strings
  const processValue = (val: any): any => {
    if (val instanceof ObjectId) {
      return val.toString();
    }
    if (val instanceof Date) {
      return val;
    }
    if (typeof val === 'string') {
      // Remove HTML tags to prevent XSS
      return val.replace(/<[^>]*>?/gm, '').trim();
    }
    if (Array.isArray(val)) {
      return val.map(processValue);
    }
    if (typeof val === 'object' && val !== null) {
      const sanitizedObj: any = {};
      for (const [key, value] of Object.entries(val)) {
        // Prevent reserved MongoDB keys ($ and .)
        if (!key.startsWith('$') && !key.includes('.')) {
          sanitizedObj[key] = processValue(value);
        }
      }
      return sanitizedObj;
    }
    return val;
  };

  const cleanData = processValue(obj);
  
  // Map MongoDB _id to standard id for client
  if (cleanData._id) {
    cleanData.id = cleanData._id.toString();
  }
  return cleanData;
}

// --- Projects CRUD ---

export async function getProjects(): Promise<any[]> {
  try {
    const db = await getDb();
    const projects = await db.collection('projects').find({}).sort({ createdAt: -1 }).toArray();
    console.log('[DB] Projects fetched:', projects.length);
    if (projects.length > 0) {
       console.log('[DB] Sample project ID type:', typeof projects[0]._id, projects[0]._id);
       console.log('[DB] Sample project sanitized ID:', sanitize(projects[0]).id);
    }
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
  if (!ObjectId.isValid(id)) {
    return { success: false, error: 'Invalid ID format' };
  }
  try {
    const db = await getDb();
    const { id: removeId, _id: removeOid, ...updateData } = formData;
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
  if (!ObjectId.isValid(id)) {
    return { success: false, error: 'Invalid ID format' };
  }
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
    console.log('[DB] Skills fetched:', skills.length);
    if (skills.length > 0) {
        console.log('[DB] Sample skill ID type:', typeof skills[0]._id, skills[0]._id);
    }
    return skills.map((s: any) => sanitize(s));
  } catch (error) {
    console.error('getSkills error:', error);
    return [];
  }
}

export async function updateSkillCategory(id: string, category: any): Promise<ActionResponse> {
  if (!ObjectId.isValid(id)) {
    return { success: false, error: 'Invalid ID format' };
  }
  try {
    const db = await getDb();
    const { id: removeId, _id: removeOid, ...updateData } = category;
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
  console.log('[DB] FETCHING_SITE_CONTENT...');
  try {
    const db = await getDb();
    const content = await db.collection('content').findOne({ type: 'global' });
    if (!content) {
      console.warn('[DB] SITE_CONTENT_MISSING: Returning null');
      return null;
    }
    console.log('[DB] SITE_CONTENT_RETRIEVED: Found document');
    return sanitize(content);
  } catch (error: any) {
    console.error('[DB] FETCH_CONTENT_ERROR:', error);
    return null;
  }
}

export async function updateSiteContent(content: any): Promise<ActionResponse> {
  console.log('[DB] UPDATING_SITE_CONTENT...');
  try {
    const db = await getDb();
    // Destructure to remove MongoDB internal fields that cause update errors
    const { _id, id, ...updateData } = content;
    
    // Log content size to debug payload issues
    const sizeInMB = Buffer.byteLength(JSON.stringify(updateData)) / (1024 * 1024);
    console.log(`[DB] PAYLOAD_SIZE: ${sizeInMB.toFixed(2)} MB`);

    const result = await db.collection('content').updateOne(
      { type: 'global' },
      { $set: updateData },
      { upsert: true }
    );
    
    console.log('[DB] UPDATE_SUCCESS:', result.modifiedCount, 'modified,', result.upsertedCount, 'upserted');
    
    revalidatePath('/');
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (error: any) {
    console.error('[DB] UPDATE_CONTENT_ERROR:', error);
    return { success: false, error: error.message || 'DATABASE_STREAM_FAILURE' };
  }
}

// --- Experience CRUD ---

import { staticExperiences } from '@/data/projects';

export async function getExperiences(): Promise<any[]> {
  try {
    const db = await getDb();
    let experiences = await db.collection('experiences').find({}).sort({ order: 1 }).toArray();
    
    // Auto-seed if empty so admin panel has valid DB entries to edit
    if (experiences.length === 0 && staticExperiences.length > 0) {
      console.log('[DB] Seeding default experiences...');
      const seedData = staticExperiences.map(({ id, ...rest }) => ({
        ...rest,
        createdAt: new Date(),
        // ensure order exists
        order: rest.order || 1
      }));
      await db.collection('experiences').insertMany(seedData);
      // Re-fetch to get the new _ids
      experiences = await db.collection('experiences').find({}).sort({ order: 1 }).toArray();
    }

    console.log('[DB] Experiences fetched:', experiences.length);
     if (experiences.length > 0) {
        console.log('[DB] Sample experience ID type:', typeof experiences[0]._id, experiences[0]._id);
    }
    return experiences.map((e: any) => sanitize(e));
  } catch (error) {
    console.error('getExperiences error:', error);
    return [];
  }
}

export async function createExperience(formData: any): Promise<ActionResponse> {
  try {
    const db = await getDb();
    const result = await db.collection('experiences').insertOne({
      ...formData,
      createdAt: new Date(),
    });
    revalidatePath('/');
    revalidatePath('/admin/dashboard');
    return { success: true, id: result.insertedId.toString() };
  } catch (error: any) {
    console.error('Create Experience Error:', error);
    return { success: false, error: error.message || 'Unknown database error' };
  }
}

export async function updateExperience(id: string, formData: any): Promise<ActionResponse> {
  if (!ObjectId.isValid(id)) {
    return { success: false, error: 'Invalid ID format' };
  }
  try {
    const db = await getDb();
    const { id: removeId, _id: removeOid, ...updateData } = formData;
    await db.collection('experiences').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    revalidatePath('/');
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (error: any) {
    console.error('Update Experience Error:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteExperience(id: string): Promise<ActionResponse> {
  if (!ObjectId.isValid(id)) {
    return { success: false, error: 'Invalid ID format' };
  }
  try {
    const db = await getDb();
    await db.collection('experiences').deleteOne({ _id: new ObjectId(id) });
    revalidatePath('/');
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (error: any) {
    console.error('Delete Experience Error:', error);
    return { success: false, error: error.message };
  }
}
