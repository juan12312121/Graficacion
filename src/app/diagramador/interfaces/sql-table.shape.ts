import * as joint from 'jointjs';

export function defineCustomTableShape() {
  if (!(joint.shapes as any).sql) {
    (joint.shapes as any).sql = {};
  }

  (joint.shapes as any).sql.Table = joint.shapes.basic.Generic.extend({
    markup: `
      <g class="rotatable">
        <g class="scalable">
          <rect class="table-body"/>
        </g>
        <rect class="table-header"/>
        <text class="table-name"/>
        <g class="fields"/>
        <g class="field-ports"/>
      </g>
    `,
    defaults: joint.util.deepSupplement({
      type: 'sql.Table',
      attrs: {
        '.table-body': {
          width: 240,
          height: 100,
          fill: '#ffffff',
          stroke: '#2b579a',
          'stroke-width': 2
        },
        '.table-header': {
          width: 240,
          height: 30,
          fill: '#2b579a',
          stroke: 'none'
        },
        '.table-name': {
          ref: '.table-header',
          'ref-y': .5,
          'ref-x': 10,
          'text-anchor': 'start',
          fill: 'white',
          'font-size': 14,
          'font-family': 'Segoe UI, Arial',
          'font-weight': 'bold'
        }
      }
    }, joint.shapes.basic.Generic.prototype.defaults)
  });
}