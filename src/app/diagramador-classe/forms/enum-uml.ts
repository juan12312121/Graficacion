import * as joint from 'jointjs';
import { claseHeader } from '../../shared-class-components/header-clase';
import { claseBody } from '../../shared-class-components/body-clase';
import { claseFooter } from '../../shared-class-components/footer-clase';
import { obtenerPuertos } from '../../shared-class-components/portsUML';
import { crearGruposDePuertos } from '../../shared-class-components/portsUML';

const header = claseHeader('Enum',{
    fill:'#eeba25',
    textColor: '#ffffff'
});

const body = claseBody('- id ',{
    fill:'#eedca9'
}


);


const footer = claseFooter('+ login(): void\n+ logout(): void', {
    fill: '#eec653',
    textColor: '#000'
});


const markup = [...header.markup, ...body.markup, ...footer.markup] 
const attrs = {...header.attrs, ...body.attrs, ...footer.attrs}

export const Enum = joint.dia.Element.define(
     'custom.Enum',
    {        
        size: {width: 200, height: 150},
        attrs,
        ports: {
            groups:crearGruposDePuertos({stroke:'#ffbd00'}),
            items: obtenerPuertos()
        }
    }, 
    {
        markup,
        portMarkup: [{
            tagName: 'circle',
            selector: 'portBody'
            }]
        
    }
);
