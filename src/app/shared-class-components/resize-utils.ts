export function getUMLSectionConfig(selectorLabel: string): {
  selectorContenedor: string;
  siguienteBloque?: string;
  alturaMinima: number;
} {
  switch (selectorLabel) {
    case 'headerLabel':
      return {
        selectorContenedor: 'header',
        siguienteBloque: 'body',
        alturaMinima: 30
      };
    case 'bodyLabel':
      return {
        selectorContenedor: 'body',
        siguienteBloque: 'footer',
        alturaMinima: 60
      };
    case 'footerLabel':
      return {
        selectorContenedor: 'footer',
        siguienteBloque: undefined, // no hay siguiente
        alturaMinima: 60
      };
    default:
      return {
        selectorContenedor: 'body',
        siguienteBloque: 'footer',
        alturaMinima: 40
      };
  }
}