import { transporter } from '../config/email.js';

export const sendEmail = async ({ to, subject, html }: { to: string; subject: string; html: string }) => {
  return transporter.sendMail({
    from: process.env.GMAIL_USER,
    to,
    subject,
    html,
  });
};
