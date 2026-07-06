import { type NextRequest } from 'next/server';
import { updateInquiryStatus } from '@/lib/repos/services';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status, notes } = await request.json();
    if (!status) return Response.json({ error: 'status is required' }, { status: 400 });
    await updateInquiryStatus(id, status, notes);
    return Response.json({ success: true });
  } catch (e) {
    console.error('[PATCH /api/service-inquiries/[id]]', e);
    return Response.json({ error: 'Failed to update inquiry' }, { status: 500 });
  }
}
