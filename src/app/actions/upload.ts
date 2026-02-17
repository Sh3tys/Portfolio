'use server';

export async function uploadFile(formData: FormData) {
  const file = formData.get('file') as File;
  if (!file) {
    throw new Error('No file uploaded');
  }

  // Convert file to Base64 for database storage (Vercel compatible)
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const base64String = buffer.toString('base64');
  const mimeType = file.type;
  
  const dataUrl = `data:${mimeType};base64,${base64String}`;
  
  return { 
    url: dataUrl,
    status: 'success' 
  };
}
