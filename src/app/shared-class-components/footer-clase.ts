import { ConfigUML } from "./IconfigUML";

export function claseFooter(label: string, config: ConfigUML = {}, selector = 'footer') {
  return {
    markup: [
       { tagName: 'rect',selector}, 
      {  
       tagName: 'text', 
        selector: `${selector}Label`,
      attributes:{
        selector: `${selector}Label` ,
        } 
      }
    ],
    attrs: {
      footer: {
        refWidth: '100%',
        refY: 'body',
        y: 90,
        height: 60,
        fill: config.fill || '#b2dfdb',
        stroke: config.stroke || '#004d40'
      },
      [`${selector}Label`]: {
        text: label,
        ref: selector,
        refX: 5,
        refY: 5,
        fill: config.textColor || '#000',
        fontWeight: config.fontSize || 'string',
        fontSize: config.fontSize || 14
      }
    }
  };
}