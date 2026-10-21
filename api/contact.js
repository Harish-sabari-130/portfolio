export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status ? res.status(200).end() : (res.statusCode = 200, res.end());
    return;
  }

  if (req.method !== 'POST') {
    if (res.status) {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: 'Method not allowed' }));
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {}
    } else if (!body) {
      let bodyStr = '';
      for await (const chunk of req) {
        bodyStr += chunk;
      }
      try {
        body = JSON.parse(bodyStr || '{}');
      } catch {
        body = {};
      }
    }

    const { name, email, message } = body || {};

    if (!name || !email || !message) {
      if (res.status) {
        return res.status(400).json({ error: 'Name, email, and message are required' });
      }
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: 'Name, email, and message are required' }));
    }

    // 1. Dispatch alert via Resend REST API (if RESEND_API_KEY is configured in Vercel)
    if (process.env.RESEND_API_KEY) {
      try {
        const targetEmail = process.env.ALERT_EMAIL || 'harish23alr@gmail.com';
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'Harish Portfolio <onboarding@resend.dev>',
            to: [targetEmail],
            reply_to: email,
            subject: `⚡ New Transmission from ${name} (Portfolio Contact)`,
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0e17; color: #ffffff; border: 1px solid rgba(0, 240, 255, 0.3); border-radius: 12px; padding: 24px;">
                <h2 style="color: #00f0ff; margin-top: 0; border-bottom: 1px solid rgba(0, 240, 255, 0.2); padding-bottom: 12px;">⚡ Quantum Uplink: New Message</h2>
                <p style="margin: 16px 0 6px 0; color: #94a3b8; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Sender Name</p>
                <p style="margin: 0; font-size: 16px; font-weight: 600; color: #ffffff;">${name}</p>
                
                <p style="margin: 16px 0 6px 0; color: #94a3b8; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Sender Email</p>
                <p style="margin: 0; font-size: 16px; color: #00f0ff;"><a href="mailto:${email}" style="color: #00f0ff; text-decoration: none;">${email}</a></p>
                
                <p style="margin: 16px 0 6px 0; color: #94a3b8; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Message</p>
                <div style="background: rgba(255,255,255,0.06); border-left: 3px solid #00f0ff; padding: 14px 18px; border-radius: 6px; font-size: 15px; line-height: 1.6; white-space: pre-wrap; color: #e2e8f0;">${message}</div>
                
                <p style="margin-top: 24px; font-size: 12px; color: #64748b; text-align: center; border-top: 1px solid #1e293b; padding-top: 12px;">
                  Sent from Harish Sabari AI Portfolio Serverless Uplink
                </p>
              </div>
            `
          })
        });
      } catch (emailErr) {
        console.error('Failed to dispatch Resend email alert:', emailErr);
      }
    } 
    // 2. Dispatch alert via Web3Forms (if WEB3FORMS_KEY is configured in Vercel)
    else if (process.env.WEB3FORMS_KEY) {
      try {
        await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            access_key: process.env.WEB3FORMS_KEY,
            name,
            email,
            message,
            subject: `⚡ Harish Portfolio: New Transmission from ${name}`,
            from_name: 'Harish Portfolio Uplink'
          })
        });
      } catch (w3Err) {
        console.error('Failed to dispatch Web3Forms alert:', w3Err);
      }
    }

    const payload = {
      success: true,
      message: 'Transmission received successfully. Harish Sabari will follow up with you shortly.',
      timestamp: new Date().toISOString()
    };

    if (res.status) {
      return res.status(200).json(payload);
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(payload));
  } catch (error) {
    if (res.status) {
      return res.status(500).json({ error: 'Failed to process transmission' });
    }
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: 'Failed to process transmission' }));
  }
}
