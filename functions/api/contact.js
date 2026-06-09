export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env.RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: "Email service not configured." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const body = await request.json();
    const name = (body.name || '').toString().trim().slice(0, 200);
    const email = (body.email || '').toString().trim().slice(0, 200);
    const subject = (body.subject || '').toString().trim().slice(0, 300);
    const message = (body.message || '').toString().trim().slice(0, 5000);

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: "Name, email, and message are required." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: "Please provide a valid email address." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const esc = (s) => s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

    const submittedAt = new Date().toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' });

    const emailHtml = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background-color:#f1f5f9;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
        <tr>
          <td style="background:#0f172a;padding:28px 40px;border-bottom:4px solid #00ff66;">
            <p style="margin:0;font-size:12px;font-weight:700;color:#00ff66;text-transform:uppercase;letter-spacing:2px;">New Contact Form Submission</p>
            <h1 style="margin:6px 0 0;font-size:22px;font-weight:700;color:#ffffff;">EternoFit Support</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
              <tr><td style="padding-bottom:16px;border-bottom:1px solid #f1f5f9;">
                <p style="margin:0 0 2px;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">From</p>
                <p style="margin:0;font-size:16px;font-weight:600;color:#1e293b;">${esc(name)}</p>
                <p style="margin:2px 0 0;font-size:14px;color:#0084ff;">${esc(email)}</p>
              </td></tr>
              <tr><td style="padding:16px 0;border-bottom:1px solid #f1f5f9;">
                <p style="margin:0 0 2px;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">Subject</p>
                <p style="margin:0;font-size:15px;color:#1e293b;">${subject ? esc(subject) : '(none provided)'}</p>
              </td></tr>
              <tr><td style="padding:16px 0;">
                <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">Message</p>
                <p style="margin:0;font-size:15px;color:#475569;line-height:1.7;white-space:pre-wrap;">${esc(message)}</p>
              </td></tr>
            </table>
            <p style="margin:24px 0 0;font-size:12px;color:#94a3b8;border-top:1px solid #f1f5f9;padding-top:16px;">Submitted ${submittedAt}. Reply directly to this email to respond to ${esc(name)}.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "EternoFit Contact <clinical@eternofit.com>",
        to: ["support@eternofit.com"],
        reply_to: email,
        subject: `[Contact] ${subject || `Message from ${name}`}`,
        html: emailHtml,
        text: `New contact form submission\n\nFrom: ${name} <${email}>\nSubject: ${subject || '(none)'}\n\nMessage:\n${message}\n\nSubmitted ${submittedAt}`
      })
    });

    const result = await res.json();

    if (res.ok) {
      return new Response(JSON.stringify({ success: true, id: result.id }), {
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ error: result.message || "Failed to send message." }), {
      status: res.status,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: `Server error: ${error.message}` }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
