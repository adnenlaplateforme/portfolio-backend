import { transporter } from '../config/email.js';

export const sendEmail = async ({ to, subject, html }: { to: string; subject: string; html: string }) => {
  return transporter.sendMail({
    from: process.env.EMAIL_PROVIDER === 'ovh' ? process.env.OVH_USER : process.env.GMAIL_USER,
    to,
    subject,
    html,
  });
};
