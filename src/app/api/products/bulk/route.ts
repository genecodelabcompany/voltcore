import { type NextRequest } from 'next/server';
import { createProduct } from '@/lib/repos/products';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';

    let products: any[] = [];

    if (contentType.includes('multipart/form-data')) {
      // CSV file upload
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      if (!file) {
        return Response.json({ error: 'CSV file is required' }, { status: 400 });
      }
      const csvText = await file.text();
      products = parseCSV(csvText);
    } else {
      // JSON body
      const body = await request.json();
      products = body.products;
      if (!Array.isArray(products) || products.length === 0) {
        return Response.json({ error: 'products array is required and must not be empty' }, { status: 400 });
      }
    }

    const results: { index: number; id: string; name: string; sku: string; success: boolean; error?: string }[] = [];

    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      try {
        const name = (p.name || '').trim();
        const sku = (p.sku || '').trim();
        const cat_id = (p.cat_id || p.category_id || '').trim();
        const price = parseFloat(p.price);
        const stock = p.stock !== undefined && p.stock !== '' ? parseInt(p.stock) : 0;
        const brand = (p.brand || 'VoltCore').trim();
        const description = (p.description || p.desc || '').trim();
        const status = (p.status || 'published').trim().toLowerCase();
        const glyph = (p.glyph || 'chip').trim();
        const image_url = (p.image_url || '').trim() || null;
        const was = p.was !== undefined && p.was !== '' ? parseFloat(p.was) : null;
        const badge = (p.badge || '').trim() || null;

        if (!name) throw new Error('name is required');
        if (!sku) throw new Error('sku is required');
        if (!cat_id) throw new Error('cat_id is required');
        if (isNaN(price)) throw new Error('price must be a valid number');

        const id = randomUUID().slice(0, 12);
        await createProduct({
          id, name, cat_id, price, was, sku, brand, badge,
          description, glyph, image_url, stock, status,
        });

        results.push({ index: i, id, name, sku, success: true });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        results.push({
          index: i,
          id: '',
          name: p.name || `Row ${i + 1}`,
          sku: p.sku || '',
          success: false,
          error: message,
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    return Response.json({
      total: products.length,
      success: successCount,
      failed: failCount,
      results,
    }, { status: failCount > 0 && successCount === 0 ? 400 : 200 });
  } catch (e) {
    console.error('[POST /api/products/bulk]', e);
    return Response.json({ error: 'Failed to process bulk upload' }, { status: 500 });
  }
}

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]);
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h.trim().toLowerCase()] = (values[idx] || '').trim();
    });
    rows.push(row);
  }

  return rows;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}
