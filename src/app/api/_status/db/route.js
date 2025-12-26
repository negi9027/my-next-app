import { testConnection } from '@/lib/db';

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      Allow: 'GET, OPTIONS',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function GET() {
  try {
    const ok = await testConnection();
    if (ok) {
      return new Response(JSON.stringify({ ok: true, message: 'DB reachable' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ ok: false, message: 'DB unreachable' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('GET /api/_status/db error:', err);
    return new Response(JSON.stringify({ ok: false, error: err?.message || String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
