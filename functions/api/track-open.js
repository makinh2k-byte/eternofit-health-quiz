export async function onRequestGet(context) {
  const { request } = context;
  const url = new URL(request.url);
  const email = url.searchParams.get('email');
  const campaign = url.searchParams.get('campaign') || 'Direct Campaign';

  // 1x1 transparent GIF binary data
  const transparentGif = new Uint8Array([
    0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 0x80, 0x00,
    0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0x21, 0xf9, 0x04, 0x01, 0x00,
    0x00, 0x00, 0x00, 0x2c, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00,
    0x00, 0x02, 0x02, 0x44, 0x01, 0x00, 0x3b
  ]);

  if (email) {
    try {
      // Direct REST API write to Firestore (No Admin SDK required, respects public rules)
      const firestoreUrl = 'https://firestore.googleapis.com/v1/projects/eternofit-67a94/databases/(default)/documents/analytics_events';
      
      await fetch(firestoreUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: {
            event: { stringValue: 'email_opened' },
            recipient: { stringValue: email },
            campaign: { stringValue: campaign },
            timestamp: { stringValue: new Date().toISOString() }
          }
        })
      });
    } catch (err) {
      console.error("Open tracking server-side logging failure:", err);
    }
  }

  // Return transparent pixel with robust anti-caching headers
  return new Response(transparentGif, {
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-store, no-cache, must-revalidate, private, post-check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
}
