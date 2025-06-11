import * as joint from 'jointjs';


export function ajustarAlturaDinamica(
  element: joint.dia.Element,
  selectorTexto: string,
  selectorContenedor: string,
  siguienteBloque?: string,
  alturaMinima: number = 30 
) {
  
  const texto = element.attr(`${selectorTexto}/text`) || '';
  const lineas = texto.split('\n').length;
  const altoLinea = 16;
  const padding = 10;

  const nuevaAltura = Math.max(alturaMinima, padding + lineas * altoLinea);

  
  element.attr(`${selectorContenedor}/height`, nuevaAltura);

  
  if (siguienteBloque) {
    const yBase = selectorContenedor === 'header'
      ? nuevaAltura
      : parseInt(element.attr(`${selectorContenedor}/y`)) + nuevaAltura;

    element.attr(`${siguienteBloque}/y`, yBase);
  }
 

  const headerH = parseInt(element.attr('header/height') || 50);
  const bodyH = parseInt(element.attr('body/height') || 60);
  const footerH = parseInt(element.attr('footer/height') || 60);

  const alturaTotal = headerH + bodyH + footerH;
  element.resize(element.size().width, Math.max(150, alturaTotal));
}