import nodemailer from 'nodemailer';

const gmailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER as string,
    pass: process.env.GMAIL_PASS as string,
  },
});

const ovhTransporter = nodemailer.createTransport({
  host: 'ssl0.ovh.net',
  port: 465,
  secure: true,
  auth: {
    user: process.env.OVH_USER as string,
    pass: process.env.OVH_PASS as string,
  },
});

export const transporter = process.env.EMAIL_PROVIDER === 'ovh' ? ovhTransporter : gmailTransporter;
