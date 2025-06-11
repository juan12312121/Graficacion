// src/shapes/sql-table.ts
import * as joint from 'jointjs';
console.log('✅ sql-table.ts se está ejecutando');

// Define el namespace si no existe
(joint.shapes as any).sql = (joint.shapes as any).sql || {};

// Solo define la figura si no existe (evita bugs y errores de doble registro)
if (!(joint.shapes as any).sql.Table) {
  (joint.shapes as any).sql.Table = joint.dia.Element.define(
    'sql.Table',
    {
      size: { width: 240, height: 100 },
      attrs: {
        '.table-header': { fill: '#2b579a', height: 30 },
        '.table-name': {
          text: 'Tabla',
          fill: '#fff',
          'font-size': 14,
          'font-weight': 'bold',
          'ref': 'table-body',
          'ref-x': 0.5,
          'ref-y': 15,
          'text-anchor': 'middle',
          'y-alignment': 'middle'
        },
        '.fields': { html: '' },
        '.field-ports': { html: '' },
        '.table-body': {
          stroke: '#2b579a',
          'stroke-width': 2,
          fill: '#fefefe'
        }
      },
      fields: []
    },
    {
      markup: [
        { tagName: 'rect', selector: 'table-body', attributes: { width: 240, height: 100 } },
        { tagName: 'g', selector: 'fields' },
        { tagName: 'g', selector: 'field-ports' },
        {
          tagName: 'text',
          selector: 'table-name',
          attributes: {
            'ref': 'table-body',
            'ref-x': 0.5,
            'ref-y': 15,
            'text-anchor': 'middle',
            'y-alignment': 'middle',
            'font-size': 14,
            'font-weight': 'bold',
            'fill': '#fff'
          }
        }
      ]
    }
  );
}
