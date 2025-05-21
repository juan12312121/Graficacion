import { ConfigUML } from "./configUML";

export function claseHeader(label: string, config: ConfigUML = {}, selector = 'header') {
  return {
    markup: [
      { tagName: 'rect',selector}, 
      {  
       tagName: 'text', 
        selector: `${selector}Label`,
      attributes:{
        selector: `${selector}Label` ,
      } }
    ],
    attrs: {
      [selector]: {
        refWidth: '100%',
        height: 30,
        fill:  config.fill || ' #00796b',
        stroke: config.stroke || '#004d40'
      },
      [`${selector}Label`]: {
        text: label,
        ref: 'header',
        refX: '50%',
        refY: '50%',
        textAnchor: 'middle',
        yAlignment: 'middle',
        fill: config.textColor || '#ffffff',
        fontWeight: config.fontSize || 'bold',
        fontSize: config.fontSize || 14
      }
    }
  };
}
