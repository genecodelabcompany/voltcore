import { type NextRequest } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = 'VoltCore Contact <noreply@voltcore.com.gh>';
const ADMIN_EMAIL = process.env.CONTACT_EMAIL || 'engineeringvoltcore@gmail.com';

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await request.json();

    if (!name || !email || !message) {
      return Response.json({ error: 'name, email and message are required' }, { status: 400 });
    }

    await resend.emails.send({
      from: FROM,
      to: [ADMIN_EMAIL],
      replyTo: email,
      subject: `[VoltCore Contact] ${subject || 'New Message'} — ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
        <p><strong>Subject:</strong> ${subject || 'General Enquiry'}</p>
        <hr />
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    // Auto-reply
    await resend.emails.send({
      from: FROM,
      to: [email],
      subject: `We received your message — VoltCore`,
      html: `
        <p>Hi ${name},</p>
        <p>Thank you for contacting VoltCore! We've received your message and will respond within 1 business day.</p>
        <p>In the meantime, you can browse our <a href="https://voltcore.com.gh/shop">shop</a> or check our <a href="https://voltcore.com.gh/services">services</a>.</p>
        <br>
        <p>Best regards,<br><strong>VoltCore Team</strong><br>📞 ${process.env.CONTACT_PHONE || '0559411222'}</p>
      `,
    });

    return Response.json({ sent: true });
  } catch (e) {
    console.error('[POST /api/email/contact]', e);
    return Response.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
