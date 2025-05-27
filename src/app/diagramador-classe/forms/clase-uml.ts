import * as joint from 'jointjs';
import { claseHeader } from '../../shared-class-components/header-clase';
import { claseBody } from '../../shared-class-components/body-clase';
import { claseFooter } from '../../shared-class-components/footer-clase';

const header = claseHeader('Clase',{
    fill:'#00796b',
    textColor: '#ffffff'
});
const body = claseBody('- id '


);


const footer = claseFooter('+ login(): void\n+ logout(): void', {
    fill: '#b2dfdb',
    textColor: '#000'
});

const markup = [...header.markup, ...body.markup, ...footer.markup] 
const attrs = {...header.attrs, ...body.attrs, ...footer.attrs}
export const ClaseUML = joint.dia.Element.define( 'custom.Clase',{
    size: {width: 200, height: 150},
    attrs
    
}, {markup});
