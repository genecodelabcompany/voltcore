import { type NextRequest } from 'next/server';

const PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY!;
const PUBLIC_KEY = process.env.IMAGEKIT_PUBLIC_KEY!;
const URL_ENDPOINT = process.env.IMAGEKIT_URL_ENDPOINT!;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'voltcore';

    if (!file) {
      return Response.json({ error: 'file is required' }, { status: 400 });
    }

    // Build ImageKit upload form
    const uploadForm = new FormData();
    uploadForm.append('file', file);
    uploadForm.append('publicKey', PUBLIC_KEY);
    uploadForm.append('folder', folder);
    uploadForm.append('useUniqueFileName', 'true');

    const res = await fetch(
      `https://upload.imagekit.io/api/v1/files/upload`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${PRIVATE_KEY}:`).toString('base64')}`,
        },
        body: uploadForm,
      }
    );

    const data = await res.json();

    if (!res.ok || data.error) {
      console.error('[ImageKit upload error]', data.error || data);
      return Response.json({ error: data.error?.message || data.message || 'Upload failed' }, { status: 502 });
    }

    return Response.json({
      url: data.url,
      fileId: data.fileId,
      width: data.width,
      height: data.height,
      thumbnailUrl: data.thumbnailUrl,
    });
  } catch (e) {
    console.error('[POST /api/upload]', e);
    return Response.json({ error: 'Upload failed' }, { status: 500 });
  }
}
