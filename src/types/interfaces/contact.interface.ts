import type { RowDataPacket } from 'mysql2/promise';

export default interface Contact extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  message: string;
  status: 'pending' | 'read' | 'replied';
  created_at: Date;
}

export interface ContactInput {
  name: string;
  email: string;
  message: string;
}
