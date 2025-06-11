import * as joint from 'jointjs';

export function obtenerPuertos(): joint.dia.Element.Port[] {
  return [
    { id: 'top', group: 'top' },
    { id: 'bottom', group: 'bottom' },
    { id: 'left', group: 'left' },
    { id: 'right', group: 'right' }
  ];
}

export function crearGruposDePuertos(config: {
  fill?: string;
  stroke?: string;
  rad?: string;
} = {}): Record<string, joint.dia.Element.PortGroup> {

  const fillColor = config.fill || '#ffffff';
  const strokeColor = config.stroke || '#31d0c6';
  const radio = config.rad || 5

  const baseAttrs = {
    portBody: {
      r: radio,
      magnet: true,
      stroke: strokeColor,
      fill: fillColor,
      strokeWidth: 2
    }
  };

  return {
    top: {
      position: { name: 'top' },
      attrs: baseAttrs
    },
    bottom: {
      position: { name: 'bottom' },
      attrs: baseAttrs
    },
    left: {
      position: { name: 'left' },
      attrs: baseAttrs
    },
    right: {
      position: { name: 'right' },
      attrs: baseAttrs
    }
  };
}