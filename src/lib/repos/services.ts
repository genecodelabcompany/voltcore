/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from '@/lib/db';

export interface ServiceRow {
  id: string;
  name: string;
  title: string;
  from_price: number;
  eta: string;
  glyph: string;
  icon: string;
  description: string;
  status: 'active' | 'inactive';
  sort_order: number;
  created_at: string;
}

export interface ServiceInquiryRow {
  id: string;
  client: string;
  client_email: string;
  client_phone: string;
  service_id: string | null;
  service_name: string;
  status: 'pending' | 'processing' | 'quoted' | 'active' | 'completed' | 'cancelled';
  budget: string;
  description: string;
  notes: string | null;
  date: string;
  updated_at: string;
}

export async function getServices(status?: string): Promise<ServiceRow[]> {
  const result = await db.execute({
    sql: `SELECT * FROM services ${status ? 'WHERE status = ?' : ''} ORDER BY sort_order ASC`,
    args: status ? [status] : [],
  });
  return result.rows as unknown as ServiceRow[];
}

export async function getServiceById(id: string): Promise<ServiceRow | null> {
  const result = await db.execute({
    sql: 'SELECT * FROM services WHERE id = ?',
    args: [id],
  });
  return (result.rows[0] as unknown as ServiceRow) ?? null;
}

export async function createService(data: Omit<ServiceRow, 'created_at'>): Promise<void> {
  await db.execute({
    sql: `INSERT INTO services (id, name, title, from_price, eta, glyph, icon, description, status, sort_order)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      data.id, data.name, data.title, data.from_price, data.eta,
      data.glyph, data.icon, data.description, data.status, data.sort_order,
    ],
  });
}

export async function updateService(
  id: string,
  data: Partial<Omit<ServiceRow, 'id' | 'created_at'>>
): Promise<void> {
  const fields = Object.keys(data);
  if (fields.length === 0) return;
  const set = fields.map(f => `${f} = ?`).join(', ');
  const values = fields.map(f => (data as Record<string, any>)[f]);
  await db.execute({ sql: `UPDATE services SET ${set} WHERE id = ?`, args: [...values, id] });
}

export async function getServiceInquiries(filters: {
  status?: string;
  limit?: number;
  offset?: number;
} = {}): Promise<{ rows: ServiceInquiryRow[]; total: number }> {
  const conditions: string[] = [];
  const args: any[] = [];

  if (filters.status && filters.status !== 'all') {
    conditions.push('status = ?');
    args.push(filters.status);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const countResult = await db.execute({ sql: `SELECT COUNT(*) as total FROM service_inquiries ${where}`, args });
  const total = Number((countResult.rows[0] as Record<string, unknown>)?.total ?? 0);

  const limit = filters.limit ?? 100;
  const offset = filters.offset ?? 0;

  const dataResult = await db.execute({
    sql: `SELECT * FROM service_inquiries ${where} ORDER BY date DESC LIMIT ? OFFSET ?`,
    args: [...args, limit, offset],
  });

  return { rows: dataResult.rows as unknown as ServiceInquiryRow[], total };
}

export async function createInquiry(data: {
  client: string;
  client_email: string;
  client_phone?: string;
  service_id?: string;
  service_name: string;
  budget?: string;
  description: string;
}): Promise<string> {
  const id = 'SR-' + Date.now().toString().slice(-6);

  await db.execute({
    sql: `INSERT INTO service_inquiries
          (id, client, client_email, client_phone, service_id, service_name, budget, description)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      id, data.client, data.client_email,
      data.client_phone ?? '', data.service_id ?? null,
      data.service_name, data.budget ?? '', data.description,
    ],
  });

  return id;
}

export async function updateInquiryStatus(
  id: string,
  status: ServiceInquiryRow['status'],
  notes?: string
): Promise<void> {
  await db.execute({
    sql: `UPDATE service_inquiries SET status = ?, updated_at = datetime('now')
          ${notes !== undefined ? ', notes = ?' : ''} WHERE id = ?`,
    args: notes !== undefined ? [status, notes, id] : [status, id],
  });
}

export async function getServiceStats(): Promise<{
  total_services: number;
  open_inquiries: number;
  active_projects: number;
}> {
  const [svc, inq] = await Promise.all([
    db.execute(`SELECT COUNT(*) as total FROM services WHERE status = 'active'`),
    db.execute(`
      SELECT
        SUM(CASE WHEN status IN ('pending','quoted') THEN 1 ELSE 0 END) as open_inquiries,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_projects
      FROM service_inquiries
    `),
  ]);
  const svcRow = svc.rows[0] as unknown as Record<string, number>;
  const inqRow = inq.rows[0] as unknown as Record<string, number>;
  return {
    total_services: svcRow.total ?? 0,
    open_inquiries: inqRow.open_inquiries ?? 0,
    active_projects: inqRow.active_projects ?? 0,
  };
}
