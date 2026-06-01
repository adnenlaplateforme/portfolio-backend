import type { RowDataPacket } from 'mysql2/promise';
import type Tag from './tag.interface.js';

export default interface Project extends RowDataPacket {
  id: number;
  title: string;
  description: string | null;
  tech_stack: string | null;
  github_url: string | null;
  demo_url: string | null;
  image_url: string | null;
  image_key: string | null;
  created_at: Date;
  updated_at: Date;
  tags?: Tag[];
}

export interface ProjectInput {
  title: string;
  description?: string | null;
  tech_stack?: string | null;
  github_url?: string | null;
  demo_url?: string | null;
  image_url?: string | null;
  image_key?: string | null;
  tag_ids?: number[];
}
