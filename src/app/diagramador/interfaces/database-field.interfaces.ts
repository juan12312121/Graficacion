export interface DatabaseField {
  name: string;
  type: string;
  pk?: boolean;
  fk?: boolean;
  notNull?: boolean;
  autoIncrement?: boolean;
  referencedTable?: string;
  referencedField?: string;
  unique?: boolean;
  defaultValue?: string;
  comment?: string;
}