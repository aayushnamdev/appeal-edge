const { Resend } = require('resend');

// Shared by /api/analyze (email submitted alongside a notice) and /api/lead
// (email submitted after the scanner already showed results).
async function sendLeadEmail(email, ip, context) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;
  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: 'Appeal Edge <onboarding@resend.dev>',
      to: ['aayush22@duck.com', 'apekshanamdev12@gmail.com'],
      subject: `New scan lead: ${email}`,
      html: `
        <h2>New Free Scan Lead</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Time:</strong> ${new Date().toISOString()}</p>
        <p><strong>IP:</strong> ${ip}</p>
        <hr/>
        <p><strong>Context:</strong></p>
        <blockquote style="color:#555">${(context || 'N/A').slice(0, 500)}</blockquote>
      `,
    });
  } catch (err) {
    console.error('[RESEND] Failed to send lead email:', err.message);
  }
}

module.exports = { sendLeadEmail };
