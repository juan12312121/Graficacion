export function linkSHalf(label: string = 'N'){
    return{
        labels: [
        {
            position: 0.9,
            attrs: {
                labelTarget: {
                text: label,
                fill: '#000',
                fontSize: 12
                }
            }
        }
        ],
      attrs: {
        labelTarget: {
          text: label
        }
    }
  };

    
}