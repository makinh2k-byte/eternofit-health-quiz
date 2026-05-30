export async function onRequestPost(context) {
  const { request, env } = context;
  
  if (!env.RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: "Resend API Key not configured." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const body = await request.json();
    const { to, subject, htmlName, reportUrl, products = [], complementary = [], answers = {}, healthScore = { score: 0, status: 'N/A', color: '#94a3b8' } } = body;

    let baseUrl;
    try {
      baseUrl = new URL(reportUrl).origin + '/';
      if (baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1')) {
        baseUrl = 'https://eternofit.com/';
      }
    } catch (e) {
      baseUrl = 'https://eternofit.com/';
    }
    const reportId = answers.id || 'CONFIDENTIAL';
    const analysisDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const primaryGoalText = answers.primaryGoal ? (Array.isArray(answers.primaryGoal) ? answers.primaryGoal.join(' & ') : answers.primaryGoal) : 'N/A';
    const specificFocusText = Array.isArray(answers.specificFocus) ? answers.specificFocus.join(', ') : (answers.specificFocus || 'N/A');

    const emailHtml = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
  <title>Your EternoFit Clinical Report</title>
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
  <style>
    /* Reset */
    * { box-sizing: border-box; }
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { margin: 0 !important; padding: 0 !important; background-color: #f1f5f9; width: 100% !important; }

    /* Links */
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; }
    u + #body a { color: inherit; text-decoration: none; font-size: inherit; }

    /* Mobile Responsive */
    @media only screen and (max-width: 620px) {
      .email-wrapper { padding: 0 !important; }
      .email-container { width: 100% !important; border-radius: 0 !important; }
      .header-pad { padding: 28px 20px !important; }
      .content-pad { padding: 24px 20px !important; }
      .footer-pad { padding: 24px 20px !important; }
      .hide-mobile { display: none !important; }

      /* Product cards stack */
      .product-img-col { display: block !important; width: 100% !important; text-align: center !important; padding: 0 0 16px 0 !important; }
      .product-img-col img { width: 120px !important; height: 120px !important; }
      .product-text-col { display: block !important; width: 100% !important; padding: 0 !important; }

      /* Meta row stacks */
      .meta-col { display: block !important; width: 100% !important; padding-bottom: 12px !important; text-align: left !important; }

      /* Vitality score stacks */
      .vitality-score-col { display: block !important; width: 100% !important; padding-bottom: 16px !important; }
      .vitality-badge-col { display: block !important; width: 100% !important; text-align: left !important; }

      /* Complementary items stack */
      .comp-item { display: block !important; width: 100% !important; padding: 0 0 32px 0 !important; text-align: center !important; }

      /* Full-width buttons */
      .btn-cta { width: 100% !important; text-align: center !important; }
      .btn-cta a { display: block !important; }

      h1 { font-size: 22px !important; }
      h2 { font-size: 36px !important; }
      .score-num { font-size: 42px !important; }
    }
  </style>
</head>
<body id="body" style="margin:0;padding:0;background-color:#f1f5f9;font-family:Helvetica,Arial,sans-serif;">

<!-- Preheader Text (hidden) -->
<div style="display:none;font-size:1px;color:#f1f5f9;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
  Your personalized health summary from EternoFit is ready. Here are the products selected for you.
</div>

<!-- Email Wrapper -->
<table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background-color:#f1f5f9;padding:40px 16px;">
  <tr>
    <td align="center">

      <!-- Email Container -->
      <table class="email-container" width="600" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 8px 30px rgba(0,0,0,0.08);">

        <!-- ===== HEADER ===== -->
        <tr>
            <td class="header-pad" style="background:#ffffff;padding:40px;text-align:center;border-bottom:4px solid #0084ff;">
            <img src="${baseUrl}Eterno%20Fit%20Logo%20Design.png" alt="EternoFit" width="72" height="72" style="width:72px;height:72px;border-radius:50%;display:block;margin:0 auto 16px;background:#000000;object-fit:contain;border:3px solid #00ff66;">
            <img src="${baseUrl}logo.png" alt="EternoFit" width="140" style="height:auto;display:block;margin:0 auto 20px;">
            <h1 style="margin:0;font-size:26px;font-weight:700;color:#1e293b;line-height:1.2;">Your Personal Health Summary</h1>
            <p style="margin:8px 0 4px;font-size:15px;color:#64748b;">Prepared exclusively for <strong>${htmlName}</strong></p>
            <p style="margin:0;font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:1.5px;">Reference: #${reportId.toUpperCase()}</p>
          </td>
        </tr>

        <!-- ===== VITALITY INDEX ===== -->
        <tr>
          <td class="content-pad" style="padding:32px 40px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background:#f8fafc;border-radius:20px;border:1px solid #e2e8f0;padding:28px;margin-bottom:0;">
              <tr>
                <td style="padding:28px;">
                  <!-- Score Row -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin-bottom:20px;">
                    <tr>
                      <td class="vitality-score-col" valign="bottom">
                        <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:2px;">Vitality Index</p>
                        <span class="score-num" style="font-size:52px;font-weight:800;color:#1e293b;line-height:1;">${healthScore.score}</span><span style="font-size:18px;color:#94a3b8;font-weight:400;">/100</span>
                      </td>
                      <td class="vitality-badge-col" valign="bottom" align="right">
                        <span style="display:inline-block;background-color:${healthScore.color};color:#ffffff;padding:7px 18px;border-radius:100px;font-size:14px;font-weight:700;">
                          Status: ${healthScore.status}
                        </span>
                      </td>
                    </tr>
                  </table>

                  <!-- Spectrum Bar -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                    <tr>
                      <td>
                        <!-- Track -->
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="height:10px;background:linear-gradient(to right,#ef4444,#f59e0b,#10b981);border-radius:5px;margin-bottom:6px;">
                          <tr><td style="height:10px;"></td></tr>
                        </table>
                        <!-- Labels -->
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                          <tr>
                            <td style="font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">Baseline</td>
                            <td align="center" style="font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">Average</td>
                            <td align="right" style="font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">Peak</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- Summary Text -->
                  <p style="margin:20px 0 0;font-size:14px;color:#475569;line-height:1.7;border-top:1px solid #e2e8f0;padding-top:20px;">
                    Your score of <strong>${healthScore.score}</strong> places you in the <strong>${healthScore.status}</strong> range. The products below have been selected to help you reach <strong>Peak</strong> performance.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ===== META ROW ===== -->
        <tr>
          <td class="content-pad" style="padding:24px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-bottom:1px solid #f1f5f9;padding-bottom:24px;">
              <tr>
                <td class="meta-col" valign="top">
                  <p style="margin:0 0 2px;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">Reference</p>
                  <p style="margin:0;font-size:15px;font-weight:600;color:#1e293b;">#${reportId.toUpperCase()}</p>
                </td>
                <td class="meta-col" valign="top" align="right">
                  <p style="margin:0 0 2px;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">Analysis Date</p>
                  <p style="margin:0;font-size:15px;font-weight:600;color:#1e293b;">${analysisDate}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ===== GREETING ===== -->
        <tr>
          <td class="content-pad" style="padding:0 40px 24px;">
            <p style="margin:0;font-size:16px;color:#1e293b;line-height:1.7;">
              Hello <strong>${htmlName}</strong>,<br><br>
              Based on your goal to improve <strong>${primaryGoalText}</strong> with a focus on <strong>${specificFocusText}</strong>, here are the products we selected specifically for you.
            </p>
          </td>
        </tr>

        <!-- ===== SECTION TITLE ===== -->
        <tr>
          <td class="content-pad" style="padding:0 40px 16px;">
            <p style="margin:0;font-size:13px;font-weight:700;color:#0084ff;text-transform:uppercase;letter-spacing:2px;">⬡ Your Recommendations</p>
          </td>
        </tr>

        <!-- ===== PRODUCTS ===== -->
        ${products.map(p => `
        <tr>
          <td class="content-pad" style="padding:0 40px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background:#f8fafc;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden;">
              <tr>
                <td style="padding:24px;">
                  <!-- Product Header Row -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                    <tr>
                      <td class="product-img-col" width="110" valign="top" style="padding-right:20px;">
                        <img src="${p.image.startsWith('http') ? p.image : baseUrl + (p.image.startsWith('/') ? p.image.substring(1) : p.image)}" alt="${p.name}" width="100" height="100" style="width:100px;height:100px;border-radius:12px;border:1px solid #e2e8f0;background:#ffffff;object-fit:contain;display:block;">
                      </td>
                      <td class="product-text-col" valign="top">
                        <p style="margin:0 0 2px;font-size:18px;font-weight:700;color:#1e293b;">${p.name}</p>
                        <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#0084ff;">✓ Top Match For You</p>
                        <p style="margin:0;font-size:14px;color:#475569;line-height:1.6;">${p.description}</p>
                        ${p.bullets && p.bullets.length > 0 ? `
                        <ul style="margin:10px 0 0;padding-left:18px;font-size:13px;color:#475569;line-height:1.6;">
                          ${p.bullets.map(b => `<li style="margin-bottom:4px;">${b}</li>`).join('')}
                        </ul>` : ''}
                      </td>
                    </tr>
                  </table>

                  <!-- Rationale Box -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin-top:20px;">
                    <tr>
                      <td style="background:#ffffff;border-radius:10px;padding:16px;border-left:4px solid #0084ff;border:1px solid #e2e8f0;border-left-width:4px;border-left-color:#0084ff;border-left-style:solid;">
                        <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#1e293b;">Why This Works For You:</p>
                        <p style="margin:0;font-size:13px;color:#475569;line-height:1.6;">${p.rationale || `Selected based on your focus on ${Array.isArray(answers.specificFocus) ? answers.specificFocus[0] : answers.specificFocus} and your goal to support ${Array.isArray(answers.primaryGoal) ? answers.primaryGoal[0] : answers.primaryGoal}.`}</p>
                      </td>
                    </tr>
                  </table>

                  <!-- CTA Button -->
                  <table class="btn-cta" width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin-top:20px;">
                    <tr>
                      <td align="center">
                        <a href="${p.affiliateLink}" target="_blank" style="display:inline-block;background:#0084ff;color:#ffffff;padding:13px 28px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;letter-spacing:0.3px;box-shadow:0 4px 14px rgba(0,132,255,0.25);">Shop Now &rarr;</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        `).join('')}

        ${complementary.length > 0 ? `
        <!-- ===== ADDITIONAL RECOMMENDATION ===== -->
        <tr>
          <td class="content-pad" style="padding:8px 40px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-top:2px dashed #e2e8f0;padding-top:28px;margin-top:8px;">
              <tr>
                <td>
                  <p style="margin:0 0 20px;font-size:13px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:2px;text-align:center;">Additional Recommendation</p>
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                    <tr>
                      ${complementary.map(p => `
                      <td class="comp-item" valign="top" style="width:50%;text-align:center;padding:0 12px;">
                        <img src="${p.image.startsWith('http') ? p.image : baseUrl + (p.image.startsWith('/') ? p.image.substring(1) : p.image)}" alt="${p.name}" width="110" height="110" style="width:110px;height:110px;border-radius:12px;border:1px solid #e2e8f0;object-fit:contain;background:#ffffff;display:block;margin:0 auto 12px;">
                        <p style="margin:0 0 6px;font-size:15px;font-weight:700;color:#1e293b;">${p.name}</p>
                        <p style="margin:0 0 10px;font-size:12px;color:#64748b;line-height:1.5;">${p.description}</p>
                        <a href="${p.affiliateLink}" target="_blank" style="display:inline-block;background:#ffffff;color:#0084ff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:700;font-size:13px;border:1px solid #0084ff;margin-top:8px;">Shop Now &rarr;</a>
                      </td>
                      `).join('')}
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        ` : ''}

        <!-- ===== SIGNATURE ===== -->
        <tr>
          <td class="content-pad" style="padding:0 40px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-top:1px solid #f1f5f9;padding-top:32px;">
              <tr>
                <td width="64" valign="top" style="padding-right:20px;">
                  <img src="${baseUrl}Eterno%20Fit%20Logo%20Design.png" alt="EternoFit" width="64" height="64" style="width:64px;height:64px;border-radius:50%;display:block;background:#000000;object-fit:contain;border:2px solid #e2e8f0;">
                </td>
                <td valign="middle">
                  <p style="margin:0;font-size:16px;font-weight:700;color:#1e293b;">The EternoFit Team</p>
                  <p style="margin:4px 0 0;font-size:14px;color:#64748b;line-height:1.4;">Clinical Wellness & Performance<br>Authorized Diagnostic Division</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>


        <!-- ===== FOOTER ===== -->
        <tr>
          <td class="footer-pad" style="background:#f8fafc;padding:32px 40px;text-align:center;border-top:1px solid #e2e8f0;">
            <p style="margin:0 0 6px;font-weight:600;color:#64748b;font-size:14px;">EternoFit Wellness</p>
            <p style="margin:0 0 8px;font-size:13px;color:#94a3b8;line-height:1.6;">You received this email because you completed a health quiz on our website. We respect your privacy.</p>
            <p style="margin:0 0 20px;font-size:12px;color:#94a3b8;">123 Performance Way, Suite 400, Austin, TX 78701</p>
            <p style="margin:0 0 12px;">
              <a href="${baseUrl}support" style="color:#94a3b8;text-decoration:underline;font-size:13px;margin:0 8px;">Support</a>
              <a href="${baseUrl}#privacy" style="color:#94a3b8;text-decoration:underline;font-size:13px;margin:0 8px;">Privacy Policy</a>
              <a href="${baseUrl}#terms" style="color:#94a3b8;text-decoration:underline;font-size:13px;margin:0 8px;">Terms of Service</a>
            </p>
            <p style="margin:0 0 8px;font-size:13px;color:#94a3b8;">© 2026 EternoFit Wellness. All rights reserved.</p>
            <p style="margin:0 0 16px;font-size:13px;font-weight:600;color:#1e293b;">support@eternofit.com</p>
            <a href="${baseUrl}unsubscribe" style="color:#94a3b8;text-decoration:underline;font-size:13px;">Unsubscribe</a>
          </td>
        </tr>

      </table>
      <!-- End Email Container -->

    </td>
  </tr>
</table>
<!-- End Email Wrapper -->

</body>
</html>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "EternoFit Clinical <clinical@eternofit.com>",
        to: [to],
        subject: subject,
        html: emailHtml,
        text: `Hello ${htmlName},

Your personalized health summary from EternoFit is ready. Based on your goals to improve ${primaryGoalText}, we have prepared a clinical evaluation and product recommendations specifically for you.

To view your full report online, please visit our site.

EternoFit Wellness
123 Performance Way, Suite 400, Austin, TX 78701
To unsubscribe: ${baseUrl}unsubscribe`
      })
    });

    const result = await res.json();
    
    if (res.ok) {
      return new Response(JSON.stringify({ success: true, id: result.id }), {
        headers: { "Content-Type": "application/json" }
      });
    } else {
      return new Response(JSON.stringify({ error: result.message || "Failed to send" }), {
        status: res.status,
        headers: { "Content-Type": "application/json" }
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: `Backend Error: ${error.message}` }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
