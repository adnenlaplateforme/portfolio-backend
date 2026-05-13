import { sendEmail } from './email.service.js';
import * as ContactModel from '../models/contact.model.js';

const adminEmail = (process.env.EMAIL_PROVIDER === 'ovh' ? process.env.OVH_USER : process.env.GMAIL_USER) as string;

export const sendContact = async ({ name, email, message }: { name: string; email: string; message: string }) => {
  await ContactModel.create({ name, email, message });
  await sendEmail({
    to: adminEmail,
    subject: `Nouveau message de contact — ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Nouveau message reçu via le portfolio</h2>
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Message :</strong></p>
        <blockquote style="border-left: 4px solid #ccc; padding-left: 16px; color: #555;">
          ${message}
        </blockquote>
      </div>
    `,
  });

  await sendEmail({
    to: email,
    subject: 'Votre message a bien été reçu',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2>Bonjour ${name},</h2>
        <p>
          Je vous remercie pour votre message et l'intérêt que vous portez à mon travail.
        </p>
        <p>
          Votre demande a bien été enregistrée. Je reviendrai vers vous dans les plus brefs délais afin
          de donner suite à votre message.
        </p>
        <p>
          En attendant, n'hésitez pas à consulter mon portfolio pour découvrir mes réalisations.
        </p>
        <p style="margin-top: 32px;">
          Cordialement,<br/>
          <strong>Adnen Said</strong><br/>
          Développeur Web Full Stack
        </p>
      </div>
    `,
  });
};
