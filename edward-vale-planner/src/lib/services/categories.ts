import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import type { Category } from '@/types/domain';
import { isValidHexColor, sanitizeText } from '@/lib/utils/sanitize';
import { categoryNameSchema } from './schemas';
import { mapCategory } from './mappers';

type Client = SupabaseClient<Database>;

export async function listCategories(supabase: Client): Promise<Category[]> {
  const { data, error } = await supabase.from('categories').select('*').order('name', { ascending: true });
  if (error) throw error;
  return data.map(mapCategory);
}

export async function createCategory(supabase: Client, name: string, color = '#64748b'): Promise<Category> {
  const clean = sanitizeText(categoryNameSchema.parse(name), 60);
  if (!isValidHexColor(color)) throw new Error('Color inválido.');

  const { data, error } = await supabase.from('categories').insert({ name: clean, color }).select('*').single();
  if (error) throw error;
  return mapCategory(data);
}

export async function deleteCategory(supabase: Client, id: string): Promise<void> {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
}
