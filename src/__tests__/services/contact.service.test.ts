import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../models/contact.model.js', () => ({ create: vi.fn() }));
vi.mock('../../services/email.service.js', () => ({ sendEmail: vi.fn() }));

import * as contactModel from '../../models/contact.model.js';
import * as emailService from '../../services/email.service.js';
import { sendContact } from '../../services/contact.service.js';

describe('sendContact', () => {
  beforeEach(() => vi.clearAllMocks());

  it('sauvegarde en DB et envoie 2 emails', async () => {
    vi.mocked(contactModel.create).mockResolvedValue(1);
    vi.mocked(emailService.sendEmail).mockResolvedValue(undefined);

    await sendContact({ name: 'Alice', email: 'alice@test.com', message: 'Bonjour !' });

    expect(contactModel.create).toHaveBeenCalledOnce();
    expect(contactModel.create).toHaveBeenCalledWith({
      name: 'Alice',
      email: 'alice@test.com',
      message: 'Bonjour !',
    });
    expect(emailService.sendEmail).toHaveBeenCalledTimes(2);
  });

  it("propage l'erreur si la DB échoue", async () => {
    vi.mocked(contactModel.create).mockRejectedValue(new Error('DB error'));

    await expect(
      sendContact({ name: 'Alice', email: 'alice@test.com', message: 'Bonjour !' }),
    ).rejects.toThrow('DB error');

    expect(emailService.sendEmail).not.toHaveBeenCalled();
  });

  it("propage l'erreur si l'envoi d'email échoue", async () => {
    vi.mocked(contactModel.create).mockResolvedValue(1);
    vi.mocked(emailService.sendEmail).mockRejectedValue(new Error('SMTP error'));

    await expect(
      sendContact({ name: 'Alice', email: 'alice@test.com', message: 'Bonjour !' }),
    ).rejects.toThrow('SMTP error');
  });
});
