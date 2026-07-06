import { type NextRequest } from 'next/server';
import { getServiceInquiries, createInquiry } from '@/lib/repos/services';

export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams;
    const { rows, total } = await getServiceInquiries({
      status: sp.get('status') ?? undefined,
      limit: sp.get('limit') ? Number(sp.get('limit')) : 100,
      offset: sp.get('offset') ? Number(sp.get('offset')) : 0,
    });
    return Response.json({ inquiries: rows, total });
  } catch (e) {
    console.error('[GET /api/service-inquiries]', e);
    return Response.json({ error: 'Failed to fetch inquiries' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { client, client_email, client_phone, service_id, service_name, budget, description } = body;

    if (!client || !client_email || !service_name) {
      return Response.json({ error: 'client, client_email and service_name are required' }, { status: 400 });
    }

    const id = await createInquiry({ client, client_email, client_phone, service_id, service_name, budget, description });
    return Response.json({ id }, { status: 201 });
  } catch (e) {
    console.error('[POST /api/service-inquiries]', e);
    return Response.json({ error: 'Failed to create inquiry' }, { status: 500 });
  }
}
