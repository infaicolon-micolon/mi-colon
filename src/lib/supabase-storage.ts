import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://mqrvqmgmyjoaaqppxlfk.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || '';

export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } })
  : null;

export const BUCKET_NAME = process.env.SUPABASE_STORAGE_BUCKET || 'mi-colon-files';

export function isSupabaseStorageConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseKey && supabase);
}

export async function uploadToSupabaseStorage(input: {
  bucket?: string;
  path: string;
  file: Buffer;
  contentType: string;
  isPublic?: boolean;
}): Promise<{ url: string; path: string }> {
  if (!supabase) {
    throw new Error('Supabase no está configurado');
  }

  const bucket = input.bucket || BUCKET_NAME;

  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const exists = buckets?.some((b) => b.name === bucket);
    if (!exists) {
      await supabase.storage.createBucket(bucket, {
        public: input.isPublic ?? true,
      });
    }
  } catch (err) {
    console.warn('Advertencia al verificar bucket de Supabase:', err);
  }

  const { error } = await supabase.storage
    .from(bucket)
    .upload(input.path, input.file, {
      contentType: input.contentType,
      upsert: true,
    });

  if (error) {
    console.error('Error subiendo a Supabase Storage:', error);
    throw new Error(`Error al subir a Supabase: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(input.path);

  return {
    url: publicUrlData.publicUrl,
    path: input.path,
  };
}

export async function downloadFromSupabaseStorage(input: {
  bucket?: string;
  path: string;
}): Promise<{ data: Blob; contentType: string }> {
  if (!supabase) {
    throw new Error('Supabase no está configurado');
  }

  const bucket = input.bucket || BUCKET_NAME;

  const { data, error } = await supabase.storage.from(bucket).download(input.path);

  if (error || !data) {
    throw new Error(`Error al descargar de Supabase: ${error?.message || 'Archivo no encontrado'}`);
  }

  return {
    data,
    contentType: data.type || 'application/octet-stream',
  };
}
