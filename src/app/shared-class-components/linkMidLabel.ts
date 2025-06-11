export function linkMidLabel(label: string = 'Relaciona') {
  return {
    labels: [
      {
        position: 0.5,
        attrs: {
          labelMiddle: {
            text: label,
            fill: '#000',
            fontSize: 12
          }
        }
      }
    ],  
    attrs: {
      labelMiddle: {
        text: label
      }
    }
  };
}
