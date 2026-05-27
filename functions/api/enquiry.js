const MAX_LENGTHS = {
  name: 120,
  surname: 120,
  email: 180,
  phone: 80,
  address: 240,
  organisation: 180,
  course: 180,
  message: 2500,
  source_page: 120,
  source_section: 160,
  page_title: 180,
  page_path: 240,
  page_url: 500
};

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: {
    'content-type': 'application/json; charset=UTF-8',
    'cache-control': 'no-store'
  }
});

const clean = (value, max = 500) => String(value || '').replace(/\s+/g, ' ').trim().slice(0, max);

const escapeHtml = (value) => clean(value, 5000)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

async function readSubmission(request) {
  const contentType = request.headers.get('content-type') || '';
  if(contentType.includes('application/json')){
    const body = await request.json();
    return new Map(Object.entries(body || {}));
  }
  if(contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')){
    return await request.formData();
  }
  return new Map();
}

async function validateTurnstile(token, request, env) {
  if(!env.TURNSTILE_SECRET_KEY){
    return { ok:false, message:'Form security is not configured yet.' };
  }
  if(!token){
    return { ok:false, message:'Please complete the security check.' };
  }
  const body = new FormData();
  body.append('secret', env.TURNSTILE_SECRET_KEY);
  body.append('response', token);
  body.append('remoteip', request.headers.get('CF-Connecting-IP') || '');
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body
  });
  const result = await response.json().catch(() => ({}));
  return result.success
    ? { ok:true }
    : { ok:false, message:'The security check failed. Please try again.' };
}

function normaliseSubmission(data) {
  const fields = {};
  for(const [key, max] of Object.entries(MAX_LENGTHS)){
    fields[key] = clean(data.get(key), max);
  }
  fields.form_type = clean(data.get('form_type'), 80) || 'enquiry';
  fields.website = clean(data.get('website'), 300);
  fields.consent = clean(data.get('consent'), 30);
  fields.turnstile = clean(data.get('cf-turnstile-response'), 1000);
  return fields;
}

function validateRequired(fields) {
  if(fields.website) return null;
  const missing = [];
  if(!fields.name) missing.push('name');
  if(!fields.email) missing.push('email');
  if(!fields.phone) missing.push('phone');
  if(!fields.message) missing.push('message');
  if(!fields.consent) missing.push('consent');
  if(missing.length){
    return `Please complete the required fields: ${missing.join(', ')}.`;
  }
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)){
    return 'Please enter a valid email address.';
  }
  return null;
}

function emailHtml(fields) {
  const rows = [
    ['Name', `${fields.name} ${fields.surname}`.trim()],
    ['Email', fields.email],
    ['Phone', fields.phone],
    ['Message', fields.message],
    ['Source page', fields.source_page],
    ['Source section', fields.source_section],
    ['Page title', fields.page_title],
    ['Page path', fields.page_path],
    ['Page URL', fields.page_url]
  ].filter(([, value]) => value);
  return `
    <h1>New Crossleys enquiry</h1>
    <table cellpadding="8" cellspacing="0" border="0">
      ${rows.map(([label, value]) => `
        <tr>
          <th align="left" valign="top">${escapeHtml(label)}</th>
          <td>${escapeHtml(value).replace(/\n/g, '<br>')}</td>
        </tr>
      `).join('')}
    </table>
  `;
}

async function sendBrevoEmail(fields, env) {
  if(!env.BREVO_API_KEY){
    return { ok:false, message:'Email delivery is not configured yet.' };
  }
  const senderEmail = env.BREVO_SENDER_EMAIL || 'your-verified-sender@example.com';
  const senderName = env.BREVO_SENDER_NAME || 'Crossleys Catering';
  const recipient = env.ENQUIRY_NOTIFICATION_EMAIL || 'crossleyscatering@gmail.com';
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'api-key': env.BREVO_API_KEY,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      sender: { email: senderEmail, name: senderName },
      to: [{ email: recipient }],
      replyTo: { email: fields.email, name: `${fields.name} ${fields.surname}`.trim() || fields.email },
      subject: `New website enquiry from ${fields.name}`,
      htmlContent: emailHtml(fields)
    })
  });
  if(!response.ok){
    return { ok:false, message:'The enquiry could not be sent. Please call or email us instead.' };
  }
  return { ok:true };
}

export async function onRequestOptions() {
  return json({ ok:true });
}

export async function onRequestGet() {
  return json({ ok:false, message:'Method not allowed.' }, 405);
}

export async function onRequestPost({ request, env }) {
  try{
    const data = await readSubmission(request);
    const fields = normaliseSubmission(data);
    const validationError = validateRequired(fields);
    if(fields.website){
      return json({ ok:true, redirect: env.ENQUIRY_SUCCESS_PATH || '/thank-you/' });
    }
    if(validationError){
      return json({ ok:false, message:validationError }, 400);
    }
    const turnstile = await validateTurnstile(fields.turnstile, request, env);
    if(!turnstile.ok){
      return json({ ok:false, message:turnstile.message }, 400);
    }
    const email = await sendBrevoEmail(fields, env);
    if(!email.ok){
      return json({ ok:false, message:email.message }, 502);
    }
    return json({ ok:true, redirect: env.ENQUIRY_SUCCESS_PATH || '/thank-you/' });
  }catch(error){
    return json({ ok:false, message:'The enquiry could not be processed. Please call or email us instead.' }, 500);
  }
}
