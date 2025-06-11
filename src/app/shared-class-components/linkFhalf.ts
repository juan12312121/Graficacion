export function linkFHalf(label: string = '1'){
    return {
    labels: [
      {
        position: 0.1,
        attrs: {
          labelSource: {
            text: label,
            fill: '#000',
            fontSize: 12
          }
        }
      }
    ],
    attrs: {
      labelSource: {
        text: label
      }
    }
  };    
}