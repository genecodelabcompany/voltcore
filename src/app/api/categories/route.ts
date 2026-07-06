import { type NextRequest } from 'next/server';
import { getCategories, createCategory, getCategoryById } from '@/lib/repos/categories';

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export async function GET() {
  try {
    const categories = await getCategories();
    return Response.json({ categories });
  } catch (e) {
    console.error('[GET /api/categories]', e);
    return Response.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, color, icon, sort_order } = await request.json();
    if (!name) return Response.json({ error: 'name is required' }, { status: 400 });

    const id = slugify(name);
    const existing = await getCategoryById(id);
    if (existing) return Response.json({ error: 'Category with this name already exists' }, { status: 409 });

    await createCategory({ id, name, slug: id, color: color ?? 'var(--c-blue)', icon: icon ?? '📦', sort_order });
    return Response.json({ id }, { status: 201 });
  } catch (e) {
    console.error('[POST /api/categories]', e);
    return Response.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
