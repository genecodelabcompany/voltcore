import { type NextRequest } from 'next/server';
import { updateCategory, deleteCategory } from '@/lib/repos/categories';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    await updateCategory(id, body);
    return Response.json({ success: true });
  } catch (e) {
    console.error('[PUT /api/categories/[id]]', e);
    return Response.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteCategory(id);
    return Response.json({ success: true });
  } catch (e) {
    console.error('[DELETE /api/categories/[id]]', e);
    return Response.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
