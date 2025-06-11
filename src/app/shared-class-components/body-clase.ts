import { ConfigUML } from "./IconfigUML";
export function claseBody(label: string, config:  ConfigUML= {}, selector = 'body') {
  return {
    markup: [
        { tagName: 'rect', selector },
      
        { tagName: 'text', 
          selector: `${selector}Label`,
          attributes: {
            selector: `${selector}Label` 
        } 
       }
    ],
    attrs: {
      [selector]: {
        refWidth: '100%',
        refY: 'header',
        y: 30,
        height: 60,
        fill: config.fill ||'#e0f2f1',
        stroke: config.stroke || '#004d40'
      },
      [`${selector}Label`]: {
        text: label,
        ref: selector,
        refX: 5,
        refY: 5,
        fill: config.textColor || '#000',
        fontSize: config.fontSize || 12,
        fontWeight: config.fontWeight || String
      }
    }
  };
}