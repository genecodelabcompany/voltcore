/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from '@/lib/db';

export interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  color: string;
  icon: string;
  sort_order: number;
  created_at: string;
}

export async function getCategories(): Promise<CategoryRow[]> {
  const result = await db.execute(
    'SELECT * FROM categories ORDER BY sort_order ASC, name ASC'
  );
  return result.rows as unknown as CategoryRow[];
}

export async function getCategoryById(id: string): Promise<CategoryRow | null> {
  const result = await db.execute({
    sql: 'SELECT * FROM categories WHERE id = ?',
    args: [id],
  });
  return (result.rows[0] as unknown as CategoryRow) ?? null;
}

export async function createCategory(data: {
  id: string;
  name: string;
  slug: string;
  color: string;
  icon: string;
  sort_order?: number;
}): Promise<void> {
  await db.execute({
    sql: `INSERT INTO categories (id, name, slug, color, icon, sort_order)
          VALUES (?, ?, ?, ?, ?, ?)`,
    args: [data.id, data.name, data.slug, data.color, data.icon, data.sort_order ?? 0],
  });
}

export async function updateCategory(
  id: string,
  data: Partial<{ name: string; slug: string; color: string; icon: string; sort_order: number }>
): Promise<void> {
  const fields = Object.keys(data);
  if (fields.length === 0) return;
  const set = fields.map(f => `${f} = ?`).join(', ');
  const values = fields.map(f => (data as Record<string, any>)[f]);
  await db.execute({
    sql: `UPDATE categories SET ${set} WHERE id = ?`,
    args: [...values, id],
  });
}

export async function deleteCategory(id: string): Promise<void> {
  await db.execute({ sql: 'DELETE FROM categories WHERE id = ?', args: [id] });
}
