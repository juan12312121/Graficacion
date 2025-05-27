import { DatabaseField } from './database-field.interfaces';

export interface TableData {
  id: string;
  name: string;
  fields: DatabaseField[];
  position: { x: number; y: number };
  comment?: string;
  engine?: string;
  charset?: string;
}