import { Injectable } from '@angular/core';
import * as joint from 'jointjs';

@Injectable({ providedIn: 'root' })
export class LinkService {
  constructor() {}
  crearLink(sourceId: string, sourcePort: string, targetId: string, targetPort: string): joint.dia.Link {
  return new joint.dia.Link({
    source: { id: sourceId, port: sourcePort },
    target: { id: targetId, port: targetPort },
    router: { name: 'manhattan' },
    connector: { name: 'rounded' },
    attrs: {
      line: {
        stroke: '#34495e',
        strokeWidth: 2,
        targetMarker: {
          type: 'classic', // puedes cambiar a 'block', 'diamond', 'circle', etc.
          fill: '#34495e',
          stroke: '#34495e'
        }
      }
    },
    labels: [
      {
        position: 0.5,
        attrs: {
          text: {
            text: 'Asociación',
            fill: '#000',
            fontSize: 12
          }
        }
      }
    ]
  });
}
}