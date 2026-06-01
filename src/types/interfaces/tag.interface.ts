import type { RowDataPacket } from 'mysql2/promise';

export default interface Tag extends RowDataPacket {
  id: number;
  name: string;
  created_at?: Date;
}

export interface TagInput {
  name: string;
}
