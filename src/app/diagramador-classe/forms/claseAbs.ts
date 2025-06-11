import * as joint from 'jointjs';
import { claseHeader } from '../../shared-class-components/header-clase';
import { claseBody } from '../../shared-class-components/body-clase';
import { claseFooter } from '../../shared-class-components/footer-clase';
import { obtenerPuertos } from '../../shared-class-components/portsUML';
import { crearGruposDePuertos } from '../../shared-class-components/portsUML';

const header = claseHeader('Clase Abstracta',{
    fill:'#6edbee',
    textColor: '#ffffff'
});

const body = claseBody('- id ',{
    fill:'#cbf0f6'
}


);


const footer = claseFooter('+ login(): void\n+ logout(): void', {
    fill: '#6edbee',
    textColor: '#000'
});


const markup = [...header.markup, ...body.markup, ...footer.markup] 
const attrs = {...header.attrs, ...body.attrs, ...footer.attrs}

export const ClaseAbs = joint.dia.Element.define(
     'custom.ClaseAbstracta',
    {        
        size: {width: 200, height: 150},
        attrs,
        ports: {
            groups:crearGruposDePuertos({stroke:'#12d4f3'}),
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
