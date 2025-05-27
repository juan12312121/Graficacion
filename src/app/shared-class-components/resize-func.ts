import * as joint from 'jointjs';

export function ajustarAlturaDinamica(
  element: joint.dia.Element,
  selectorTexto: string,
  selectorContenedor: string,
  siguienteBloque: string
): void {
  const texto = element.attr(`${selectorTexto}/text`) || '';
  const lineas = texto.split('\n').length;
  const altoLinea = 20;
  const padding = 10;
  const nuevaAltura = padding + lineas * altoLinea;

  console.log(lineas, texto, padding)

  element.attr(`${selectorContenedor}/height`, nuevaAltura);

  const yBase = selectorContenedor === 'header' ? 30 : 30 + nuevaAltura;
  element.attr(`${siguienteBloque}/y`, yBase);

  console.log(nuevaAltura)

}