import nodemailer from 'nodemailer';
import { SecureAPIHandler } from '@/lib/SecureAPIHandler';

// Initialize the secure handler: Limit to 5 emails per minute per IP
const emailSecurityHandler = new SecureAPIHandler('EMAIL_API', 5, 60000);

export async function POST(req) {
  return emailSecurityHandler.execute(req, ['to', 'subject', 'html'], async (payload) => {
    const { to, subject, html } = payload;

    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (!user || !pass) {
      throw new Error("Email credentials not configured in environment variables.");
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });

    const mailOptions = {
      from: `"GenZ Tuition Center" <${user}>`,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    return { message: 'Email sent successfully' };
  });
}
