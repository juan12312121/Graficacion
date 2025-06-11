import * as joint from 'jointjs';

import { claseBody } from '../../shared-class-components/body-clase';





const body = claseBody('[Nota]' ,{
    fill:'#feeaf8',
    textColor:'#000',
    stroke:'#000000'
});


const markup = [...body.markup] 
const attrs = {...body.attrs}
export const NotaUML = joint.dia.Element.define( 'custom.Nota',{
    size: {width: 200, height: 150},
    attrs
    
}, {markup
    });

