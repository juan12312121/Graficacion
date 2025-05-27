import * as joint from 'jointjs';

/**
 * Crea y retorna una línea de conexión visualmente atractiva entre tablas (JointJS Link).
 * @param sourceTable Tabla de origen (modelo JointJS)
 * @param sourceFieldIndex Índice del campo en la tabla de origen
 * @param targetTable Tabla destino (modelo JointJS)
 * @param targetFieldIndex Índice del campo en la tabla destino
 * @param options Opcional: estilos personalizados de línea
 * @returns joint.dia.Link | null
 */
export function createStylishLink(
  sourceTable: any,
  sourceFieldIndex: number,
  targetTable: any,
  targetFieldIndex: number,
  options?: {
    stroke?: string,
    strokeWidth?: number,
    strokeDasharray?: string,
    markerColor?: string,
    markerShape?: string
  }
): joint.dia.Link | null {
  if (!sourceTable || !targetTable) return null;

  const link = new joint.dia.Link({
    source: { id: sourceTable.id, port: `field-${sourceFieldIndex}-right` },
    target: { id: targetTable.id, port: `field-${targetFieldIndex}-left` },
    attrs: {
      '.connection': {
        stroke: options?.stroke || '#2196f3',
        'stroke-width': options?.strokeWidth ?? 3,
        'stroke-dasharray': options?.strokeDasharray || '10,6',
        'stroke-linecap': 'round',
        filter: 'drop-shadow(0px 2px 6px #1976d299)',
        opacity: 0.9
      },
      '.marker-target': {
        fill: options?.markerColor || '#1976d2',
        d: options?.markerShape || 'M 14 0 L 0 7 L 14 14 z',
        stroke: options?.markerColor || '#1976d2',
        'stroke-width': 1
      }
    },
    router: { name: 'smooth' },
    connector: { name: 'rounded' }
  });

  return link;
}