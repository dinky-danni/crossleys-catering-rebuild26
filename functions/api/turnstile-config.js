export async function onRequestGet({ env }) {
  return new Response(JSON.stringify({
    turnstileSiteKey: env.TURNSTILE_SITE_KEY || ''
  }), {
    headers: {
      'content-type': 'application/json; charset=UTF-8',
      'cache-control': 'no-store'
    }
  });
}
