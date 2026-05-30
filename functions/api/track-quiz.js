/**
 * Cloudflare Worker — returns the visitor's real IP and geo location.
 * Firestore writes are handled client-side via the Firebase SDK.
 */
export async function onRequestPost(context) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    // Get the real IP from Cloudflare headers
    const ip = context.request.headers.get('CF-Connecting-IP')
      || context.request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim()
      || context.request.headers.get('X-Real-IP')
      || 'Unknown';

    // Get geo information from Cloudflare
    const cf = context.request.cf || {};
    const location = [cf.city, cf.region, cf.country].filter(Boolean).join(', ') || 'Unknown';

    return new Response(JSON.stringify({ ip, location }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (error) {
    return new Response(JSON.stringify({ ip: 'Unknown', location: 'Unknown' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
