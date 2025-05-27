import { DatabaseField } from './database-field.interfaces';

// Normaliza tipos de campos (para comparar compatibilidad)
export function normalizeFieldType(type: string): string {
  if (type.startsWith('VARCHAR')) return 'VARCHAR';
  if (type.startsWith('CHAR')) return 'CHAR';
  return type;
}

// Verifica compatibilidad básica entre tipos de campos, para FK
export function areFieldTypesCompatible(type1: string, type2: string): boolean {
  const norm1 = normalizeFieldType(type1);
  const norm2 = normalizeFieldType(type2);

  if (norm1 === norm2) return true;

  const compatibilities: { [key: string]: string[] } = {
    'INT': ['BIGINT', 'SMALLINT'],
    'VARCHAR': ['CHAR', 'TEXT'],
    'CHAR': ['VARCHAR'],
    'BIGINT': ['INT'],
    'SMALLINT': ['INT']
  };

  return compatibilities[norm1]?.includes(norm2) || compatibilities[norm2]?.includes(norm1);
}

// Devuelve el icono unicode para el campo
export function getFieldIcon(field: DatabaseField): string {
  if (field.pk) return '🔑';
  if (field.fk) return '🔗';
  if (field.unique) return '🔹';
  return '📄';
}

// Devuelve array de badges para el campo
export function getFieldBadges(field: DatabaseField): string[] {
  const badges = [];
  if (field.pk) badges.push('PK');
  if (field.fk) badges.push('FK');
  if (field.unique) badges.push('UQ');
  if (field.notNull) badges.push('NN');
  if (field.autoIncrement) badges.push('AI');
  return badges;
}