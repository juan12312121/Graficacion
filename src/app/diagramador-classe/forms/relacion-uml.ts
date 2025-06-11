import * as joint from 'jointjs';

export const RelacionUML = joint.dia.Link.define('custom.FlechaRelacion',
  {
    attrs: {
      line: {
        stroke: '#000',
        strokeWidth: 2,
        targetMarker: {
          type: 'block',
          width: 12,
          height: 8,
          d: 'M 10 -5 0 0 10 5 z'
        }
      },
      labelSource: { text: '1' },
      labelTarget: { text: 'N' },
      labelMiddle: { text: 'Relaciona' }
    },
    labels: [
      { position: 0.1, attrs: { labelSource: { text: '1' } } },
      { position: 0.9, attrs: { labelTarget: { text: 'N' } } },
      { position: 0.5, attrs: { labelMiddle: { text: 'Relaciona' } } }
    ]
  },
  {
    markup: [
      {
        tagName: 'path',
        selector: 'line',
        attributes: {
          d: '',
          fill: 'none',
          stroke: '#000',
          'stroke-width': 2,
          'pointer-events': 'visibleStroke'
        }
      }
    ],
    labelMarkup: [
      {
        tagName: 'text',
        selector: 'labelSource',
        attributes: {
          'font-size': '12',
          fill: '#000',
          'text-anchor': 'middle',
          'y-alignment': 'middle'
        }
      },
      {
        tagName: 'text',
        selector: 'labelTarget',
        attributes: {
          'font-size': '12',
          fill: '#000',
          'text-anchor': 'middle',
          'y-alignment': 'middle'
        }
      },
      {
        tagName: 'text',
        selector: 'labelMiddle',
        attributes: {
          'font-size': '12',
          fill: '#000',
          'text-anchor': 'middle',
          'y-alignment': 'middle'
        }
      }
    ]
  }
);